import { Kysely, PostgresDialect } from 'kysely';
import { createPool } from '@/lib/psql';

export const db = new Kysely({
  dialect: new PostgresDialect({
    pool: createPool(),
  }),
  log: ['query', 'error'],
});
