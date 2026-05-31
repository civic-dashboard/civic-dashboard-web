import postgres from 'postgres';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const createPostgres = () => {
  let connectionString = process.env.DATABASE_URL;

  try {
    const context = getCloudflareContext() as {
      env?: { HYPERDRIVE?: { connectionString?: string } };
    };
    if (context.env?.HYPERDRIVE?.connectionString) {
      connectionString = context.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // getCloudflareContext may fail in non-Cloudflare environments (e.g. during build or local scripts)
  }

  if (!connectionString)
    throw new Error('No value for "DATABASE_URL" or "HYPERDRIVE" provided');

  return postgres(connectionString, {
    max: process.env.NODE_ENV === 'production' ? 1 : undefined,
  });
};
