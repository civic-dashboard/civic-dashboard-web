import { fetchAgendaItems } from '@/api/agendaItem';
import {
  insertAgendaItems,
  insertAgendaItemSubjectTerms,
} from '@/database/queries/agendaItems';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { normalizeSubjectTerms } from '@/database/queries/agendaItems';
export const populateAgendaItems = async (
  db: Kysely<DB>,
  start: Date,
  end: Date,
) => {
  let insertedCount = BigInt(0);
  let current = start;
  while (current < end) {
    const nextMonth = new Date(current);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    console.log(`fetching from ${current} to ${nextMonth}`);
    const agendaItems = await fetchAgendaItems({
      start: current,
      end: nextMonth > end ? end : nextMonth,
    });
    if (agendaItems.length > 0) {
      const result = await insertAgendaItems(db, agendaItems);
      insertedCount += result[0].numInsertedOrUpdatedRows ?? BigInt(0);
      /*
       * Consider incorporating into cleanAgendaItem function in @/api/agendaItem if normalized subject terms are to be stored in table RawAgendaItemConsiderations
       * This is a separate step to avoid modifying the original RawAgendaItemConsiderations, a few options brainstormed below (open to suggestions!):
       * -> Option 1 [selected]: Normalize in the pipeline applying only on new incoming data and apply to stored data in a separate job
       * -> Option 2 (see src/scripts/processAgendaItemSubjectTerms.ts): Normalize after insertion in a separate job for the sake of data synchronization
       */
      const normalizedSubjectTerms = normalizeSubjectTerms(agendaItems);
      console.log(
        normalizedSubjectTerms.length,
        'normalized subject terms found',
      );
      // Insert normalized subject terms into the database table AgendaItemSubjectTerm
      await insertAgendaItemSubjectTerms(db, normalizedSubjectTerms);
    }
    console.log('inserted:', insertedCount);

    current = nextMonth;

    if (current < end) {
      // wait a second before fetching again to avoid overloading the TMMIS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
