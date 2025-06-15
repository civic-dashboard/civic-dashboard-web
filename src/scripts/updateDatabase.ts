import { createDB } from '@/database/kyselyDb';
import { populateAgendaItems } from '@/database/pipelines/populateAgendaItems';
import { ImportAiSummaries } from '@/scripts/importAiSummaries';

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

const references = await populateAgendaItems(createDB(), lastMonth, nextMonth);
await ImportAiSummaries.run(createDB(), references);

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
