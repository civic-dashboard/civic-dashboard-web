import postgres from 'postgres';

export const createPostgres = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    throw new Error(`No value for "DATABASE_URL" provided`);

  return postgres(connectionString);
};
