import { getDB } from '@/database/kyselyDb';
import Link from 'next/link';

async function listCouncillors() {
  return await getDB()
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

export default async function CouncillorListPage() {
  const councillors = await listCouncillors();
  return (
    <div className="max-w-screen-sm mx-auto mt-3">
      <h2>Toronto Councillors</h2>
      <ul>
        {councillors.map((councillor) => (
          <li
            key={councillor.contactSlug}
            className="border border-slate-200 bg-white even:bg-slate-50 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 even:dark:bg-slate-900 dark:text-slate-50 rounded-md mb-2"
          >
            <Link
              href={`/councillors/${councillor.contactSlug}`}
              className="p-2 flex gap-2 hover:underline"
              prefetch={false}
            >
              <CouncillorContactPhoto photoUrl={councillor.photoUrl} />
              <div>
                <h3 className="text-lg">{councillor.contactName}</h3>
                <p>{councillor.wardName}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CouncillorContactPhoto(props: { photoUrl: string | null }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={props.photoUrl ?? ''}
      className="bg-zinc-300"
      style={{ height: 52, width: 42 }}
      alt="" // Omit alt text since this is decorative
    />
  );
}
