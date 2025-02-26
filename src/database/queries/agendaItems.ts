import { AgendaItem } from '@/api/agendaItem';
import { getDB } from '@/database/kyselyDb';
import { JsonArray } from '@/database/allDbTypes';
import { agendaItemConflictColumns } from '@/database/columns';

export const insertAgendaItems = async (items: AgendaItem[]) => {
  const asDBType = items.map(({ id: _, agendaItemAddress, ...item }) => ({
    ...item,
    agendaItemAddress: agendaItemAddress as unknown as JsonArray,
  }));

  // kinda convoluted upsert but it gets the job done 🤷
  return await getDB()
    .insertInto('RawAgendaItemConsiderations')
    .onConflict((onConflict) =>
      onConflict.columns(['reference', 'meetingId']).doUpdateSet((eb) =>
        Object.fromEntries(
          agendaItemConflictColumns
            .filter((c) => c !== 'id')
            .map((k) => [
              k,
              eb
                .case()
                .when(
                  'RawAgendaItemConsiderations.agendaItemId',
                  '<=',
                  eb.ref('excluded.agendaItemId'),
                )
                .then(eb.ref(`excluded.${k}`))
                .else(eb.ref(`RawAgendaItemConsiderations.${k}`))
                .end(),
            ]),
        ),
      ),
    )
    .values(asDBType)
    .execute();
};
