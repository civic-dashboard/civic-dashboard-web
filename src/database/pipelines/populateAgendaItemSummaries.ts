import { createDB } from '@/database/kyselyDb';

import DOMPurify, {
  type Config as DOMPurifyConfig,
} from 'isomorphic-dompurify';

export async function populateAgendaItemSummaries() {
  const db = createDB();
  const rawSummaries = await db
    .selectFrom('RawAgendaItemConsiderations')
    .distinctOn('reference')
    .select(['reference', 'agendaItemSummary'])
    .where('agendaItemSummary', 'is not', null)
    .where('reference', 'in', (eb) =>
      eb.selectFrom('AgendaItems').select('agendaItemNumber'),
    )
    .execute();

  const config: DOMPurifyConfig = {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'ul',
      'ol',
      'li',
      'span',
      'em',
      'sup',
      // 'a', // Todo: tricky since we ought to add rel, target, and class
    ],
    ALLOWED_ATTR: ['title'],
  };

  const summaries = new Array<{ reference: string; safeSummary: string }>();
  for (const { reference, agendaItemSummary } of rawSummaries) {
    const safeSummary = DOMPurify.sanitize(agendaItemSummary, config);
    if (!safeSummary) throw new Error(`No content after sanitize`);
    summaries.push({ reference, safeSummary });
  }

  // Todo: Write the summaries somewhere usable?
}

await populateAgendaItemSummaries();
process.exit(0);
