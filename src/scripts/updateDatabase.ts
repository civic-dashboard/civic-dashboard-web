import { createDB } from '@/database/kyselyDb';
import { populateAgendaItems } from '@/database/pipelines/populateAgendaItems';
import { ImportAiSummaries } from '@/scripts/importAiSummaries';

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

const references = await populateAgendaItems(createDB(), lastMonth, nextMonth);

if (process.env.OPENAI_API_KEY) {
  await ImportAiSummaries.run(createDB(), references);
} else {
  console.log(
    'Skipping AI summary generation: The environment variable OPENAI_API_KEY is not set.',
  );
}

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
