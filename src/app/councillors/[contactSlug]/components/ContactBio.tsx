import { Avatar } from '@/components/Avatar';

type SharedBioInfo = {
  photoUrl: string | null;
  contactName: string;
  email: string;
  phone: string | null;
};

type CouncillorBioInfo = SharedBioInfo & {
  role: 'councillor';
  wardName: string;
  wardId: string;
};

type MayorBioInfo = SharedBioInfo & {
  role: 'mayor';
};

export default function ContactBio({
  contact,
}: {
  contact: CouncillorBioInfo | MayorBioInfo;
}) {
  return (
    <section className="m-8">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Avatar size={190} src={contact.photoUrl} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{contact.contactName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {contact.role === 'councillor' && (
              <>
                Ward {contact.wardId}, {contact.wardName}
              </>
            )}
            {contact.role === 'mayor' && <>Mayor of Toronto</>}
          </p>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="font-bold">Email</dt>
            <dd>
              <a
                className="text-blue-500 underline"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </dd>

            {contact.phone && (
              <>
                <dt className="font-bold">Phone</dt>
                <dd>
                  <a
                    className="text-blue-500 underline"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
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
