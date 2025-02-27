import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';

let db: Kysely<DB>;

const createDB = () =>
  new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  });

export const getDB = () => {
  if (db === undefined) {
    db = createDB();
  }
  return db;
};
