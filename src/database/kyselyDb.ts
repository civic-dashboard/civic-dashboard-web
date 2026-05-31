import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import React from 'react';

// React.cache is only available in the Next.js runtime.
// Standalone scripts (like updateDatabase) will fail (The requested module 'react' does not provide an export named 'cache')
// if we try to use it directly. This fallback ensures compatibility across both.
const cache =
  (React as unknown as { cache?: <T>(fn: T) => T }).cache ||
  (<T>(fn: T): T => fn);

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

  // In production runtime (Cloudflare Workers), we avoid global singletons to prevent
  // connection leaks or stale state between requests. React.cache provides a
  // request-scoped singleton, ensuring only one DB instance is created per request.
  return createNewDb();
});
