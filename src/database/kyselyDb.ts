import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { createPostgres } from '@/database/psql';
import { DB } from '@/database/allDbTypes';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

const isDuringBuild = () => process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

let buildTimeDb: Kysely<DB> | null = null;

export const createDB = () => {
  if (isDuringBuild()) {
    buildTimeDb ??= createNewDb();
    return buildTimeDb;
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
