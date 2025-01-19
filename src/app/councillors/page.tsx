import { db } from '@/lib/kdb';

async function listCouncillors() {
  return await db
    .selectFrom('Councillors')
    .innerJoin('Contacts', (eb) =>
      eb.onRef('Councillors.contactSlug', '=', 'Contacts.contactSlug'),
    )
    .innerJoin('Wards', (eb) =>
      eb.onRef('Councillors.wardSlug', '=', 'Wards.wardSlug'),
    )
    .select([
      'Contacts.contactSlug',
      'Contacts.contactName',
      'Contacts.photoUrl',
      'Wards.wardName',
    ])
    .execute();
}

export default async function CouncillorListPage() {
  const councillors = await listCouncillors();
  return <div>{JSON.stringify(councillors)}</div>;
}
