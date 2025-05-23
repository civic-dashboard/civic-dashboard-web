import { readFile } from 'fs/promises';
import { parse } from 'csv-parse';
import { argv } from 'process';
import { Kysely, Transaction } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { createDB } from '@/database/kyselyDb';

class ImportAiSummaries {
  public static async run(inputFileName: string, db: Kysely<DB>) {
    try {
      await db.transaction().execute(async (trx) => {
        await new ImportAiSummaries(inputFileName, trx).run();
      });
    } catch (error) {
      console.error(`Error during ImportAiSummaries`, error);
      throw error;
    }
  }

  private constructor(
    private readonly inputFileName: string,
    private readonly trx: Transaction<DB>,
  ) {}

  private async run() {
    if (!this.inputFileName)
      throw new Error(`Invalid file name ${this.inputFileName}`);

    const candidateIds = await this.getCandidateAgendaItems();
    const inputStream = await this.createInputStream();

    const summaries = new Array<SummaryRow>();
    for await (const inputRow of inputStream) {
      if (!candidateIds.has(inputRow.reference)) continue;
      summaries.push({
        agendaItemNumber: inputRow.reference,
        summary: inputRow.ai_summary,
      });
    }
    console.log('Found usable summaries', summaries);
    await this.upsertSummaries(summaries);
    console.log(`Finished, inserted or updated ${summaries.length} summaries`);
  }

  private async getCandidateAgendaItems() {
    const rows = await this.trx
      .selectFrom('AgendaItems')
      .innerJoin('RawAgendaItemConsiderations', (eb) =>
        eb.onRef('agendaItemNumber', '=', 'reference'),
      )
      .select('agendaItemNumber')
      .distinct()
      .execute();

    return new Set(rows.map((row) => row.agendaItemNumber));
  }

  private async createInputStream(): Promise<AsyncIterable<InputRow>> {
    return parse(await readFile(this.inputFileName), {
      columns: true,
    });
  }

  private async upsertSummaries(summaries: SummaryRow[]) {
    await this.trx.deleteFrom('AiSummaries').execute();
    await this.trx.insertInto('AiSummaries').values(summaries).execute();
  }
}

type InputRow = { reference: string; ai_summary: string };
type SummaryRow = {
  summary: string;
  agendaItemNumber: string;
};

//! Actually runs the program
await ImportAiSummaries.run(argv[2], createDB());
process.exit(0);
