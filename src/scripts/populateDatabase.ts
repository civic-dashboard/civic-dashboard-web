import { populateAgendaItems } from '@/database/pipelines/populateAgendaItems';

const beginningOfTerm = 1472706000000;
const endOfTerm = 1794632400000;

await populateAgendaItems(new Date(beginningOfTerm), new Date(endOfTerm));

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
