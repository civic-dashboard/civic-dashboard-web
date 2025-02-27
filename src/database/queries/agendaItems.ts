import { AgendaItem } from '@/api/agendaItem';
import { getDB } from '@/database/kyselyDb';
import { JsonArray } from '@/database/allDbTypes';
import { agendaItemConflictColumns } from '@/database/columns';

export const insertAgendaItems = async (items: AgendaItem[]) => {
  const asDBType = items.map(({ id: _, agendaItemAddress, ...item }) => ({
    ...item,
    agendaItemAddress: agendaItemAddress as unknown as JsonArray,
  }));

  // kinda convoluted upsert but it gets the job done 🤷:

  // for ez idempotent updates, it makes sense to just re-insert
  // all the data from the previous to next month (rather than trying
  // to compare whether the data needs updating, or risk inserting duplicate rows).

  // since agenda item considerations can change over time
  // (most notably, before/after the council actually votes on it)
  // we need to run an ON CONFLICT clause in the INSERT query,
  // which requires a UNIQUE constraint on the columns specified in the ON CONFLICT clause

  // that UNIQUE constraint (mostly) holds over the source data set, but there were a
  // couple instances of it not being true. in those instances, the only way to differentiate
  // the two agenda items is using `agendaItemId`, because they have the same reference,
  // same meeting ID, same meeting time, etc.

  // the newer one (by inspection of relevant columns that might not be possible to automate) had a higher agendaItemId.
  // if agendaItemId is tied we take the fresh values

  // all of this is just best effort to get the thing off the ground and we can refine later

  return await getDB()
    .insertInto('RawAgendaItemConsiderations')
    .onConflict((onConflict) =>
      onConflict.columns(['reference', 'meetingId']).doUpdateSet((eb) =>
        Object.fromEntries(
          agendaItemConflictColumns
            .filter((column) => column !== 'id')
            .map((column) => [
              column,
              eb
                .case()
                .when(
                  'RawAgendaItemConsiderations.agendaItemId',
                  '<=',
                  eb.ref('excluded.agendaItemId'),
                )
                .then(eb.ref(`excluded.${column}`))
                .else(eb.ref(`RawAgendaItemConsiderations.${column}`))
                .end(),
            ]),
        ),
      ),
    )
    .values(asDBType)
    .execute();
};
