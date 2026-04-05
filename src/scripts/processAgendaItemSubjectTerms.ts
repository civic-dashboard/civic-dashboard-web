import { processAgendaItemSubjectTerms } from '@/database/queries/agendaItems';
import { createDB } from '@/database/kyselyDb';

// For the purpose of updating the subject terms in the database as a separate job
// it's only called manually with npm run tsxe src/scripts/processAgendaItemSubjectTerms.ts , not done through an automatic job
// only needed if subject terms need a full re-normalization, so it will clean out AgendaItemSubjectTerms and AgendaItemCategories
// a reason to do that is if we change the assignment of subject terms to categories in TagCategories
// Another reason would be if the normalization logic itself (how we turn "STREETS-AND-ROADS" into "streets and roads") were to change in src/database/pipelines/textParseUtils.ts.
await processAgendaItemSubjectTerms(createDB());

// so manually exit here, for consistency w/ other scripts
process.exit(0);
