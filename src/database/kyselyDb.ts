import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';

const globalForDb = globalThis as unknown as {
  __kysely_db__: Kysely<DB> | undefined;
};

export const createDB = () => {
  // Use a singleton for all phases (Build, Dev, Prod).
  // should fix connection exhaustion crashes during runtime.
  if (globalForDb.__kysely_db__) return globalForDb.__kysely_db__;

  const db = createNewDb();
  globalForDb.__kysely_db__ = db;
  return db;
};

const createNewDb = () => {
  return new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  });
};
