import { getDB } from '@/database/kyselyDb';
import { Transaction, sql } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { TorontoCouncilClient } from '@/backend/toronto-council/TorontoCouncilClient';

export async function repopulateRawAgendaItems() {
  try {
    await getDB()
      .transaction()
      .execute(async (trx) => {
        await RepopulateRawAgendaItems.run(trx);
      });
  } catch (error) {
    console.error(`Error during repopulateRawAgendaItems`, error);
    throw error;
  }
}

class RepopulateRawAgendaItems {
  private constructor(private readonly trx: Transaction<DB>) {}

  public static async run(trx: Transaction<DB>) {
    const instance = new RepopulateRawAgendaItems(trx);
    return await instance.run();
  }

  private async run() {
    // November 15, 2022.
    const currentTermStartedOn = {
      year: 2022,
      month: 11,
      day: 15,
    };
    const tcClient = new TorontoCouncilClient();
    const allAgendaItems = await tcClient.getAgendaItems(currentTermStartedOn);
    await sql`TRUNCATE "RawAgendaItems";`.execute(this.trx);
    const batchSize = 500;
    while (allAgendaItems.length > 0) {
      const batch = allAgendaItems.splice(0, batchSize);
      await sql`
        INSERT INTO
          "RawAgendaItems" ("data")
        SELECT
          jsonb_array_elements(${batch}::jsonb)
      `.execute(this.trx);
    }
  }
}
