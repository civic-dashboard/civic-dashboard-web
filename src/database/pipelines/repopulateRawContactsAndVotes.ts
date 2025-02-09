import {
  OpenDataClient,
  PackageResource,
} from '@/backend/open-data/OpenDataClient';
import { InsertRawContact, InsertRawVote } from '@/database/allDbTypes';

import { db } from '@/database/kyselyDb';
import { formatContactCsvStream } from '@/database/pipelines/rawContactCsvParser';
import { formatVoteCsvStream } from '@/database/pipelines/rawVoteCsvParser';
import { extractTermFromText } from '@/database/pipelines/textParseUtils';
import { sql } from 'kysely';

const INSERT_BATCH_SIZE = 2_500;

export async function repopulateRawContactsAndVotes() {
  try {
    const openDataClient = new OpenDataClient();
    void repopulateRawContacts;
    await repopulateRawContacts(openDataClient);
    await repopulateRawVotes(openDataClient);
    await refreshMatViews();
  } catch (error) {
    console.error(`Error during repopulateRawContactsAndVotes`, error);
    throw error;
  }
}

const isCompleteCsvResource = (resource: PackageResource) =>
  !resource.is_preview &&
  resource.format.toLocaleLowerCase() === 'csv' &&
  resource.url.endsWith('.csv');

const refreshMatViews = async () => {
  await sql`
    REFRESH MATERIALIZED VIEW "Contacts";
    REFRESH MATERIALIZED VIEW "Councillors";
    REFRESH MATERIALIZED VIEW "Wards";
    REFRESH MATERIALIZED VIEW "Committees";
    REFRESH MATERIALIZED VIEW "AgendaItems";
    REFRESH MATERIALIZED VIEW "ProblemAgendaItems";
    REFRESH MATERIALIZED VIEW "Motions";
    REFRESH MATERIALIZED VIEW "Votes";
  `.execute(db);
};

async function repopulateRawVotes(openDataClient: OpenDataClient) {
  const votesPackage = await openDataClient.showPackage('votes');
  const [mostRecentVoteResource] = votesPackage.result.resources
    .filter(isCompleteCsvResource)
    .map((resource) => ({
      url: resource.url,
      term: extractTermFromText(resource.name),
    }))
    .sort((a, b) => b.term.localeCompare(a.term));
  if (!mostRecentVoteResource) {
    throw new Error(`No suitable voting resources found`, {
      cause: votesPackage.result.resources,
    });
  }
  const requestStream = await openDataClient.fetchDataset(
    mostRecentVoteResource.url,
  );
  await deleteAllRawVotes();
  await bulkInsertRawVotes(
    formatVoteCsvStream(mostRecentVoteResource.term, requestStream),
  );
}

async function repopulateRawContacts(openDataClient: OpenDataClient) {
  const contactsPackage = await openDataClient.showPackage('contacts');
  await deleteAllRawContacts();
  for (const resource of contactsPackage.result.resources) {
    if (!isCompleteCsvResource(resource)) continue;
    const term = extractTermFromText(resource.name);
    const requestStream = await openDataClient.fetchDataset(resource.url);
    await bulkInsertRawContacts(formatContactCsvStream(term, requestStream));
  }
}

async function* asBatches<T>(
  input: AsyncIterable<T>,
  batchSize: number,
): AsyncIterable<Array<T>> {
  let batch = new Array<T>();
  for await (const item of input) {
    batch.push(item);
    if (batch.length === batchSize) {
      yield batch;
      batch = new Array<T>();
    }
  }
  if (batch.length > 0) yield batch;
}

async function bulkInsertRawContacts(
  rowStream: AsyncIterable<InsertRawContact>,
) {
  for await (const batch of asBatches(rowStream, INSERT_BATCH_SIZE)) {
    await db.insertInto('RawContacts').values(batch).execute();
  }
}

async function bulkInsertRawVotes(rowStream: AsyncIterable<InsertRawVote>) {
  for await (const batch of asBatches(rowStream, INSERT_BATCH_SIZE)) {
    await db.insertInto('RawVotes').values(batch).execute();
  }
}

const deleteAllRawContacts = async () => {
  await sql`TRUNCATE "RawContacts";`.execute(db);
};

const deleteAllRawVotes = async () => {
  await sql`TRUNCATE "RawVotes";`.execute(db);
};
