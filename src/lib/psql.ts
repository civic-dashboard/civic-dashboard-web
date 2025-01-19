import { Pool } from 'pg';

export const createPool = () => {
  const config = {
    host: process.env.PGHOST,
    port: +process.env.PGPORT!,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  };
  for (const [key, value] of Object.entries(config)) {
    if (!value) throw new Error(`Missing PSQL configuration option "${key}"`);
  }
  return new Pool(config);
};
