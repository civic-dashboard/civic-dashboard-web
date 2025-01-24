import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/lib/psql';
import { DB } from '@/lib/allDbTypes';

export const db = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: createPostgres(),
  }),
  log: ['query', 'error'],
});
