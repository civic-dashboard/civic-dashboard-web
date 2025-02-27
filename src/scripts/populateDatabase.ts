import { createDB } from '@/database/kyselyDb';
import { populateAgendaItems } from '@/database/pipelines/populateAgendaItems';

const beginningOfTerm = 883630800000;
const endOfTerm = 1794632400000;

await populateAgendaItems(
  createDB(),
  new Date(beginningOfTerm),
  new Date(endOfTerm),
);

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
