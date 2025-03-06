import { createDB } from '@/database/kyselyDb';
import { populateAgendaItems } from '@/database/pipelines/populateAgendaItems';

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

await populateAgendaItems(createDB(), lastMonth, nextMonth);

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
