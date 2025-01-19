import { Kysely, PostgresDialect } from 'kysely';
import { createPool } from '@/lib/psql';
import { DB } from '@/lib/allDbTypes';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: createPool(),
  }),
  log: ['query', 'error'],
});
