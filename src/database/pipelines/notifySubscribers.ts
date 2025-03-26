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

export const notifySubscribers = async (db: Kysely<DB>) => {
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
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await setAgendaItemsToNotified(db);
  });
};
