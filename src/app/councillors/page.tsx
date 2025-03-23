'use server';
import { createDB } from '@/database/kyselyDb';
import { ExternalLink } from '@/components/ExternalLink';
import { CouncillorsList } from '@/components/CouncillorsList';
import { sql } from 'kysely';

async function listCouncillors() {
  return await createDB()
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
      sql<string>`
      LOWER(
        CONCAT_WS(
          ', ',
          "Contacts"."contactName",
          "Wards"."wardName",
          "Wards"."wardId"
        )
      )
    `.as('searchTarget'),
    ])
    .orderBy(['Contacts.contactName'])
    .execute();
}

const membersOfCouncilLink =
  'https://www.toronto.ca/city-government/council/members-of-council/';

export default async function CouncillorListPage() {
  const councillors = await listCouncillors();

  return (
    <div className="max-w-screen-sm mx-auto my-4 px-2">
      <section className="mt-4">
        <h2>Find Your Councillor</h2>
        <p>
          Not sure who your councillor is? No problem!{' '}
          <ExternalLink href={membersOfCouncilLink} className="classic-link">
            The Members of Council page
          </ExternalLink>{' '}
          can show what <em>ward</em> you are a part of. Each councillor serves
          one ward, and all Toronto wards are listed here.
        </p>
      </section>
      <section className="mt-4">
        <CouncillorsList councillors={councillors} />
      </section>
    </div>
  );
}
