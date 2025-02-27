import { fetchAgendaItems } from '@/api/agendaItem';
import { insertAgendaItems } from '@/database/queries/agendaItems';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';

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
    }
    console.log('inserted:', insertedCount);

    current = nextMonth;

    if (current < end) {
      // wait a second before fetching again to avoid overloading the TMMIS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
