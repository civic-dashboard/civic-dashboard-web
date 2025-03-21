import { createDB } from '@/database/kyselyDb';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';
import { cn } from '@/components/ui/utils';
import { Avatar } from '@/components/Avatar';

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
    ])
    .orderBy(['Contacts.contactName'])
    .execute();
}

const wardProfilesLink =
  'https://www.toronto.ca/city-government/data-research-maps/neighbourhoods-communities/ward-profiles/';

export default async function CouncillorListPage() {
  const councillors = await listCouncillors();
  return (
    <div className="max-w-screen-sm mx-auto my-4 px-2">
      <section className="mt-4">
        <h2>Find Your Councillor</h2>
        <p>
          Not sure who your councillor is? No problem!{' '}
          <ExternalLink href={wardProfilesLink} className="underline">
            The ward profiles page
          </ExternalLink>{' '}
          can show what <em>ward</em> you are a part of. Each councillor serves
          one ward, and all Toronto wards are listed here.
        </p>
      </section>
      <section className="mt-4">
        <h2>Current Toronto Councillors</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {councillors.map((councillor) => (
            <li
              key={councillor.contactSlug}
              className={cn(
                'border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950  dark:text-slate-50 rounded-md',
                'max-md:even:bg-slate-50 max-md:even:dark:bg-slate-900',
              )}
            >
              <Link
                href={`/councillors/${councillor.contactSlug}`}
                className="p-2 flex gap-2 hover:underline"
                prefetch={false}
              >
                <Avatar src={councillor.photoUrl} size={52} />
                <div>
                  <h3 className="text-lg">{councillor.contactName}</h3>
                  <p>{councillor.wardName}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
