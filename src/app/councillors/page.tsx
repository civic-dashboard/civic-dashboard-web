'use server';
import { Metadata } from 'next';
import { createDB } from '@/database/kyselyDb';
import { CouncillorListContainer } from '@/components/CouncillorListContainer';
import { sql } from 'kysely';
import { Page } from '@/components/ui/page';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Councillors on Toronto City Council – Civic Dashboard',
  };
}

export type Role = 'Mayor' | 'Councillor';

async function listCouncillors() {
  return await createDB()
    .with('CouncillorsAndMayor', (eb) =>
      eb
        .selectFrom('Councillors')
        .select([
          'contactSlug',
          'term',
          sql<string | null>`"wardSlug"`.as('wardSlug'),
          sql<Role>`'Councillor'`.as('role'),
        ])
        .unionAll((eb) =>
          eb
            .selectFrom('Mayors')
            .select([
              'contactSlug',
              'term',
              sql<null>`null`.as('wardSlug'),
              sql<Role>`'Mayor'`.as('role'),
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
      'Wards.wardId',
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
    .orderBy([
      sql`CASE WHEN role = 'Mayor' THEN 0 ELSE 1 END`,
      'Contacts.contactName',
    ])
    .execute();
}

export default async function CouncillorListPage() {
  const councillors = await listCouncillors();

  return (
    <Page>
      <CouncillorListContainer councillors={councillors} />
    </Page>
  );
}
