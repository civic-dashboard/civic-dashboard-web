import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { cache } from 'react';

const globalForDb = globalThis as unknown as {
  __kysely_db__: Kysely<DB> | undefined;
};

const createNewDb = () => {
  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  });
};

export const createDB = cache(() => {
  // Use a singleton in non-production environments (Dev, Test)
  // OR during the production build phase (Static Generation).
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
  ) {
    if (globalForDb.__kysely_db__) return globalForDb.__kysely_db__;

    const db = createNewDb();
    globalForDb.__kysely_db__ = db;
    return db;
  }

  // In production runtime (Cloudflare Workers), React.cache handles the singleton
  // scope per request, avoiding stale context issues of global singletons.
  return createNewDb();
});
