import { createDB } from '@/database/kyselyDb';
import { refreshAllSubscriptionQueries } from '@/database/queries/subscriptions';

await refreshAllSubscriptionQueries(createDB());

// for some reason the script doesn't end properly when run for a wide date range
// so manually exit here
process.exit(0);
