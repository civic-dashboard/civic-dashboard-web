import { EventData } from '@/api/event';

function EngagementButtonParent({ content }: { content: string }) {
  return (
    <div
      className="flex flex-row mt-2 [&>a]:p-1 [&>a]:px-3 [&>a]:bg-sky-700 [&>a]:rounded-md [&>a]:text-white"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export function EventCard({ event }: { event: EventData }) {
  const {
    eventName,
    description,
    startDateTime,
    endDateTime,
    locations,
    orgName,
    orgEmail,
    orgPhone,
    eventWebsite,
    timeInfo,
    // image,
  } = event.calEvent;

  let cta: string | undefined;
  if (timeInfo) cta = timeInfo;
  if (locations[0].displayAddress?.startsWith('<a'))
    cta = locations[0].displayAddress;

  return (
    <div className="bg-white p-4 shadow-md min-w-0">
      {/* <img
        src={'https://secure.toronto.ca' + image.url}
        alt={image.altText}
        className="w-full h-48 object-cover rounded-t-lg"
      /> */}
      <h2>{eventName}</h2>
      {cta && <EngagementButtonParent content={cta} />}
      <p className="mt-2" dangerouslySetInnerHTML={{ __html: description }} />

      <div className="mt-4">
        <h3 className="text-lg  font-semibold">Date & Time</h3>
        <p className="">
          {new Date(startDateTime).toLocaleString()} -{' '}
          {new Date(endDateTime).toLocaleString()}
        </p>
      </div>

      {locations[0].locationName !== 'Online' && (
        <div className="mt-4">
          <h3 className="text-lg   font-semibold">Location</h3>
          {locations.map(
            (location, index) =>
              location.locationName !== 'Online' && (
                <div key={index}>
                  <p>
                    <span className="font-semibold">
                      {location.locationName}:{' '}
                    </span>
                    <span>{location.displayAddress}</span>
                  </p>
                </div>
              )
          )}
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg   font-semibold">Organizer</h3>
        <p className="">{orgName}</p>
        <p className="">Email: {orgEmail}</p>
        <p className="">Phone: {orgPhone}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">More Information</h3>
        <p className="">
          <a href={eventWebsite} className="text-blue-500 hover:underline">
            Event Website
          </a>
        </p>
      </div>
    </div>
  );
}
