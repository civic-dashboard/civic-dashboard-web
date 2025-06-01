import { processAgendaItemSubjectTerms } from '@/database/queries/agendaItems';
import { createDB } from '@/database/kyselyDb';

// For the purpose of updating the subject terms in the database,
await processAgendaItemSubjectTerms(createDB());

// so manually exit here, for consistency w/ other scripts
process.exit(0);
