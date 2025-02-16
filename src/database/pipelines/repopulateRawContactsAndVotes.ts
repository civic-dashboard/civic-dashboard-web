import {
  OpenDataClient,
  PackageResource,
} from '@/backend/open-data/OpenDataClient';
import { DB, InsertRawContact, InsertRawVote } from '@/database/allDbTypes';

import { getDB } from '@/database/kyselyDb';
import { formatContactCsvStream } from '@/database/pipelines/rawContactCsvParser';
import { formatVoteCsvStream } from '@/database/pipelines/rawVoteCsvParser';
import { extractTermFromText } from '@/database/pipelines/textParseUtils';
import { Transaction, sql } from 'kysely';

export async function repopulateRawContactsAndVotes() {
  try {
    await getDB()
      .transaction()
      .execute(async (trx) => {
        await RepopulateRawContactsAndVotesPipeline.run(trx);
      });
  } catch (error) {
    console.error(`Error during repopulateRawContactsAndVotes`, error);
    throw error;
  }
}

class RepopulateRawContactsAndVotesPipeline {
  private static BATCH_SIZE = 2_500;
  private constructor(
    private readonly trx: Transaction<DB>,
    private readonly openDataClient: OpenDataClient,
  ) {}

  public static async run(trx: Transaction<DB>) {
    const instance = new RepopulateRawContactsAndVotesPipeline(
      trx,
      new OpenDataClient(),
    );
    return await instance.run();
  }

  private async run() {
    await this.repopulateRawContacts();
    await this.repopulateRawVotes();
    await this.refreshMatViews();
  }

  private async refreshMatViews() {
    await sql`
      REFRESH MATERIALIZED VIEW "Contacts";

      REFRESH MATERIALIZED VIEW "Councillors";

      REFRESH MATERIALIZED VIEW "Wards";

      REFRESH MATERIALIZED VIEW "Committees";

      REFRESH MATERIALIZED VIEW "AgendaItems";

      REFRESH MATERIALIZED VIEW "ProblemAgendaItems";

      REFRESH MATERIALIZED VIEW "Motions";

      REFRESH MATERIALIZED VIEW "Votes";
    `.execute(this.trx);
  }

  private async repopulateRawContacts() {
    const contactsPackage = await this.openDataClient.showPackage('contacts');
    await this.deleteAllRawContacts();
    for (const resource of contactsPackage.result.resources) {
      if (!isCompleteCsvResource(resource)) continue;
      const term = extractTermFromText(resource.name);
      const requestStream = await this.openDataClient.fetchDataset(
        resource.url,
      );
      await this.bulkInsertRawContacts(
        formatContactCsvStream(term, requestStream),
      );
    }
  }

  private async repopulateRawVotes() {
    const votesPackage = await this.openDataClient.showPackage('votes');
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
    const requestStream = await this.openDataClient.fetchDataset(
      mostRecentVoteResource.url,
    );
    await this.deleteAllRawVotes();
    await this.bulkInsertRawVotes(
      formatVoteCsvStream(mostRecentVoteResource.term, requestStream),
    );
  }

  private async bulkInsertRawContacts(
    rowStream: AsyncIterable<InsertRawContact>,
  ) {
    for await (const batch of asBatches(
      rowStream,
      RepopulateRawContactsAndVotesPipeline.BATCH_SIZE,
    )) {
      await this.trx.insertInto('RawContacts').values(batch).execute();
    }
  }

  private async bulkInsertRawVotes(rowStream: AsyncIterable<InsertRawVote>) {
    for await (const batch of asBatches(
      rowStream,
      RepopulateRawContactsAndVotesPipeline.BATCH_SIZE,
    )) {
      await this.trx.insertInto('RawVotes').values(batch).execute();
    }
  }

  private async deleteAllRawContacts() {
    await sql`TRUNCATE "RawContacts";`.execute(this.trx);
  }

  private async deleteAllRawVotes() {
    await sql`TRUNCATE "RawVotes";`.execute(this.trx);
  }
}

const isCompleteCsvResource = (resource: PackageResource) =>
  !resource.is_preview &&
  resource.format.toLocaleLowerCase() === 'csv' &&
  resource.url.endsWith('.csv');

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
