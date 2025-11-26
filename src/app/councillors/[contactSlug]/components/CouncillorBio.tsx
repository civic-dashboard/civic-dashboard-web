'use server';
import { createDB } from '@/database/kyselyDb';
import { Kysely } from 'kysely';
import { DB } from '@/database/allDbTypes';
import { Avatar } from '@/components/Avatar';

async function getCouncillor(db: Kysely<DB>, contactSlug: string) {
  return await db
    .selectFrom('Councillors')
    .innerJoin('Contacts', (eb) =>
      eb.onRef('Contacts.contactSlug', '=', 'Councillors.contactSlug'),
    )
    .innerJoin('Wards', (eb) =>
      eb.onRef('Wards.wardSlug', '=', 'Councillors.wardSlug'),
    )
    .select([
      'Councillors.contactSlug',
      'Contacts.contactName',
      'Contacts.email',
      'Contacts.phone',
      'Contacts.photoUrl',
      'Wards.wardName',
      'Wards.wardId',
    ])
    .where('Councillors.contactSlug', '=', contactSlug)
    .executeTakeFirstOrThrow();
}

export default async function CouncillorBio({
  contactSlug,
}: {
  contactSlug: string;
}) {
  const councillor = await getCouncillor(createDB(), contactSlug);

  return (
    <section className="m-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Avatar src={councillor.photoUrl} size={190} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{councillor.contactName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ward {councillor.wardId}, {councillor.wardName}
          </p>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="font-bold">Email</dt>
            <dd>
              <a className="classic-link" href={`mailto:${councillor.email}`}>
                {councillor.email}
              </a>
            </dd>

            {councillor.phone && (
              <>
                <dt className="font-bold">Phone</dt>
                <dd>
                  <a className="classic-link" href={`tel:${councillor.phone}`}>
                    {councillor.phone}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
