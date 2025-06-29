import { Kysely, Transaction } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { createDB } from '@/database/kyselyDb';
import { generateSummaryForReference } from '@/database/pipelines/generateAISummary';

export class ImportAiSummaries {
  public static async run(db: Kysely<DB>, references: Set<string>) {
    try {
      await db.transaction().execute(async (trx) => {
        await new ImportAiSummaries(trx, db, references).run();
      });
    } catch (error) {
      console.error(`Error during ImportAiSummaries`, error);
      throw error;
    }
  }

  private constructor(
    private readonly trx: Transaction<DB>,
    private readonly db: Kysely<DB>,
    private references: Set<string>,
  ) {}

  private async run() {
    if (this.references.size === 0) {
      this.references = await this.getCandidateAgendaItems();
    }

    const summaries = new Array<SummaryRow>();

    for (const candidateId of this.references) {
      const summary = await generateSummaryForReference(this.db, candidateId);
      if (!summary) continue;
      summaries.push({
        agendaItemNumber: candidateId,
        summary,
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

  private async upsertSummaries(summaries: SummaryRow[]) {
    await this.trx.deleteFrom('AiSummaries').execute();
    await this.trx.insertInto('AiSummaries').values(summaries).execute();
  }
}

type SummaryRow = {
  summary: string;
  agendaItemNumber: string;
};

//! Actually runs the program
const references = new Set<string>();
await ImportAiSummaries.run(createDB(), references);
process.exit(0);
