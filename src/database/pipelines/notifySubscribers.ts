import { createHash } from 'node:crypto';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import {
  getSubscribersToNotify,
  setAgendaItemsToNotified,
} from '@/database/queries/agendaItems';
import { sendSubscriptionUpdateEmail } from '@/backend/emails/sendSubscriptionUpdateEmail';
import {
  areSearchFiltersIdentical,
  SubscribableSearchFilters,
} from '@/logic/search';
import { TagEnum } from '@/constants/tags';

// Sends happen inside one transaction, so a failed send rolls back the whole
// run. The key lets a same-day rerun skip subscribers Resend already emailed.
// Resend keeps keys for 24 hours, so it won't stop a repeat on the next night.
// The email is hashed to stay under Resend's 256-character key limit.
const subscriptionUpdateKey = (runDate: string, email: string) =>
  `subscription-update/${runDate}/${createHash('sha256').update(email).digest('hex')}`;

export const notifySubscribers = async (db: Kysely<DB>) => {
  const runDate = new Date().toISOString().slice(0, 10);
  await db.transaction().execute(async (db) => {
    const emailsToSend = await getSubscribersToNotify(db);

    const groupedBySubscriber = emailsToSend.reduce(
      (acc, next) => {
        if (!acc[next.email]) {
          acc[next.email] = [];
        }
        acc[next.email].push(next);
        return acc;
      },
      {} as Record<string, typeof emailsToSend>,
    );

    console.log(
      `Sending emails to ${Object.keys(groupedBySubscriber).length} subscribers!`,
    );

    for (const subscriberUpdates of Object.values(groupedBySubscriber)) {
      const dedupedFilters = subscriberUpdates
        .map((update) => ({
          textQuery: update.textQuery,
          tags: update.tags as TagEnum[],
          decisionBodyIds: update.decisionBodyIds,
        }))
        .reduce((acc, update) => {
          if (
            acc.some((otherUpdate) =>
              areSearchFiltersIdentical(update, otherUpdate),
            )
          ) {
            return acc;
          }
          acc.push(update);
          return acc;
        }, [] as SubscribableSearchFilters[]);

      await sendSubscriptionUpdateEmail({
        to: subscriberUpdates[0].email,
        props: {
          unsubscribeToken: subscriberUpdates[0].unsubscribeToken,
          items: subscriberUpdates,
          filters: dedupedFilters,
        },
        idempotencyKey: subscriptionUpdateKey(
          runDate,
          subscriberUpdates[0].email,
        ),
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await setAgendaItemsToNotified(db);
  });
};
