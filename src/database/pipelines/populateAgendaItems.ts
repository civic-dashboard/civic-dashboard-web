import { fetchAgendaItems } from '@/api/agendaItem';
import { insertAgendaItems } from '@/database/queries/agendaItems';

export const populateAgendaItems = async (start: Date, end: Date) => {
  let insertedCount = BigInt(0);
  while (start < end) {
    const nextMonth = new Date(start);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    console.log(`fetching from ${start} to ${nextMonth}`);
    const agendaItems = await fetchAgendaItems({
      start,
      end: nextMonth > end ? end : nextMonth,
    });
    if (agendaItems.length > 0) {
      const result = await insertAgendaItems(agendaItems);
      insertedCount += result[0].numInsertedOrUpdatedRows ?? BigInt(0);
    }
    console.log('inserted:', insertedCount);

    start = nextMonth;

    if (start < end) {
      // wait a second before fetching again to avoid overloading the TMMIS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
