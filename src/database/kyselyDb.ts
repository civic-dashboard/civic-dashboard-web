import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';

export const db = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: createPostgres(),
  }),
  log: ['query', 'error'],
});
