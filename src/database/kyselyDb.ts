import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';

const globalForDb = globalThis as unknown as {
  __kysely_db__: Kysely<DB> | undefined;
};

export const createDB = () => {
  if (globalForDb.__kysely_db__) return globalForDb.__kysely_db__;
  const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  });
  globalForDb.__kysely_db__ = db;
  return db;
};
