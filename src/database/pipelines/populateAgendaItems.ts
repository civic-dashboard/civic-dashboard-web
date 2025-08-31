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
  const references: Set<string> = new Set<string>();
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
      agendaItems.forEach((item) => {
        references.add(item.reference);
      });

      insertedCount += result[0].numInsertedOrUpdatedRows ?? BigInt(0);
      const normalizedSubjectTerms = normalizeSubjectTerms(agendaItems);
      console.log(
        `${normalizedSubjectTerms.length} normalized subject terms found`,
      );
      await insertAgendaItemSubjectTerms(db, normalizedSubjectTerms);
    }
    console.log('inserted:', insertedCount);

    current = nextMonth;

    if (current < end) {
      // wait a second before fetching again to avoid overloading the TMMIS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return new Set(references);
};
