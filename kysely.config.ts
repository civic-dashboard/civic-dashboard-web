import { defineConfig } from 'kysely-ctl';

import { Kysely, PostgresDialect } from 'kysely';

// Kysely CLI does not respect import-aliases yet
// eslint-disable-next-line no-restricted-imports
import { createPool } from './src/lib/psql';

export default defineConfig({
  kysely: new Kysely({
    dialect: new PostgresDialect({
      pool: createPool(),
    }),
    log: ['query', 'error'],
  }),
  migrations: {
    migrationFolder: 'src/migrations',
  },
});
