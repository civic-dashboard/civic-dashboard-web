import { AgendaItem } from '@/api/agendaItem';
import { getDB } from '@/database/kyselyDb';
import { JsonArray } from '@/database/allDbTypes';
import { agendaItemColumns } from '@/database/columns';

export const insertAgendaItems = async (items: AgendaItem[]) => {
  const asDBType = items.map(({ id: _, agendaItemAddress, ...item }) => ({
    ...item,
    agendaItemAddress: agendaItemAddress as unknown as JsonArray,
  }));

  // kinda convoluted upsert but it gets the job done 🤷
  return await getDB()
    .insertInto('AgendaItem')
    .onConflict((onConflict) =>
      onConflict.columns(['reference', 'meetingId']).doUpdateSet((eb) =>
        Object.fromEntries(
          agendaItemColumns
            .filter((c) => c !== 'id')
            .map((k) => [
              k,
              eb
                .case()
                .when(
                  'AgendaItem.agendaItemId',
                  '<=',
                  eb.ref('excluded.agendaItemId'),
                )
                .then(eb.ref(`excluded.${k}`))
                .else(eb.ref(`AgendaItem.${k}`))
                .end(),
            ]),
        ),
      ),
    )
    .values(asDBType)
    .execute();
};
