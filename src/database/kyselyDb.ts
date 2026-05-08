import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

const globalForDb = globalThis as unknown as {
  __kysely_db__: Kysely<DB> | undefined;
};

export const createDB = () => {
  // Use a singleton in non-production environments (Dev, Test)
  // OR during the production build phase (Static Generation).
  // In production runtime (e.g. Cloudflare Workers), we revert to standard instantiation
  // to avoid environment-specific issues with global singletons.
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD
  ) {
    if (globalForDb.__kysely_db__) return globalForDb.__kysely_db__;

    const db = createNewDb();
    globalForDb.__kysely_db__ = db;
    return db;
  }

  return createNewDb();
};

const createNewDb = () => {
  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  });
};
