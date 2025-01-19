import { defineConfig } from 'kysely-ctl';
// Kysely CLI does not respect import-aliases yet
// eslint-disable-next-line no-restricted-imports
import { createPool } from './src/lib/psql';

export default defineConfig({
  dialect: 'pg',
  dialectConfig: {
    pool: createPool(),
  },
  migrations: {
    migrationFolder: 'src/migrations',
  },
});
