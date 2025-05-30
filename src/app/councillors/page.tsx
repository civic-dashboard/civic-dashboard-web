'use server';
import { Metadata } from 'next';
import { createDB } from '@/database/kyselyDb';
import { ExternalLink } from '@/components/ExternalLink';
import { CouncillorsList } from '@/components/CouncillorsList';
import { sql } from 'kysely';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Councillors on Toronto City Council – Civic Dashboard',
  };
}

export type Role = 'mayor' | 'councillor';

async function listCouncillors() {
  return await createDB()
    .with('CouncillorsAndMayor', (eb) =>
      eb
        .selectFrom('Councillors')
        .select([
          'contactSlug',
          'term',
          sql<string | null>`"wardSlug"`.as('wardSlug'),
          sql<Role>`'councillor'`.as('role'),
        ])
        .unionAll((eb) =>
          eb
            .selectFrom('Mayors')
            .select([
              'contactSlug',
              'term',
              sql<null>`null`.as('wardSlug'),
              sql<Role>`'mayor'`.as('role'),
            ]),
        ),
    )
    .selectFrom('CouncillorsAndMayor')
    .innerJoin('Contacts', (eb) =>
      eb.onRef('CouncillorsAndMayor.contactSlug', '=', 'Contacts.contactSlug'),
    )
    .leftJoin('Wards', (eb) =>
      eb.onRef('CouncillorsAndMayor.wardSlug', '=', 'Wards.wardSlug'),
    )
    .select([
      'Contacts.contactSlug',
      'Contacts.contactName',
      'Contacts.photoUrl',
      'role',
      'Wards.wardName',
      sql<string>`
      LOWER(
        CONCAT_WS(
          ', ',
          "Contacts"."contactName",
          "Wards"."wardName",
          "Wards"."wardId",
          "role"
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
