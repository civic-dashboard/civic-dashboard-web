import {
  OpenDataClient,
  PackageResource,
} from '@/backend/open-data/OpenDataClient';
import { DB, InsertRawContact, InsertRawVote } from '@/database/allDbTypes';
import { createDB } from '@/database/kyselyDb';
import { reencode } from '@/database/pipelines/csvUtils';

import { formatContactCsvStream } from '@/database/pipelines/rawContactCsvParser';
import { formatVoteCsvStream } from '@/database/pipelines/rawVoteCsvParser';
import { extractTermFromText } from '@/database/pipelines/textParseUtils';
import { Kysely, Transaction, sql } from 'kysely';

class RepopulateRawContactsAndVotes {
  private static BATCH_SIZE = 2_500;
  private constructor(
    private readonly trx: Transaction<DB>,
    private readonly openDataClient: OpenDataClient,
  ) {}

  public static async run(db: Kysely<DB>) {
    try {
      await db.transaction().execute(async (trx) => {
        await new RepopulateRawContactsAndVotes(
          trx,
          new OpenDataClient(),
        ).run();
      });
    } catch (error) {
      console.error(`Error during RepopulateRawContactsAndVotes`, error);
      throw error;
    }
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
    const contactsResources = contactsPackage.result.resources.filter(
      isCompleteCsvResource,
    );
    // TODO: Adjust this based on constraints or add logic to determine batch size dynamically
    const batchSize = 4;
    await processInBatches(contactsResources, batchSize, async (resource) => {
      console.log(`Processing resource ${resource.name}`);
      const term = extractTermFromText(resource.name);
      const requestStream = await this.openDataClient.fetchDataset(
        resource.url,
        'utf8',
      );
      await this.bulkInsertRawContacts(
        formatContactCsvStream(
          term,
          requestStream.map((chunk) => reencode(chunk, 'latin1')),
        ),
      );
    });
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
      RepopulateRawContactsAndVotes.BATCH_SIZE,
    )) {
      await this.trx.insertInto('RawContacts').values(batch).execute();
    }
  }

  private async bulkInsertRawVotes(rowStream: AsyncIterable<InsertRawVote>) {
    for await (const batch of asBatches(
      rowStream,
      RepopulateRawContactsAndVotes.BATCH_SIZE,
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
  input: AsyncIterable<T> | Array<T>,
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

async function processInBatches<T>(
  items: AsyncIterable<T> | Array<T>,
  batchSize: number,
  processFunction: (item: T) => Promise<void>,
) {
  for await (const batch of asBatches(items, batchSize)) {
    await Promise.all(batch.map((item) => processFunction(item)));
  }
}

await RepopulateRawContactsAndVotes.run(createDB());
process.exit(0);
