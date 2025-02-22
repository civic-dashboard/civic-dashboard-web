import { defineConfig } from 'kysely-ctl';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { Kysely } from 'kysely';

// Kysely CLI does not respect import-aliases yet
// eslint-disable-next-line no-restricted-imports
import { createPostgres } from './src/database/psql';

export default defineConfig({
  kysely: new Kysely({
    dialect: new PostgresJSDialect({
      postgres: createPostgres(),
    }),
    log: ['error'],
  }),
  migrations: {
    migrationFolder: 'src/migrations',
  },
});
