import { Pool } from 'pg';

export const createPool = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error(`No value for "DATABASE_URL" provided`);

  return new Pool({ connectionString });
};
