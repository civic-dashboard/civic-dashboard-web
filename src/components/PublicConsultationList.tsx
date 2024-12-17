import { EventData, fetchPublicConsultations } from '@/api/publicConsultation';
import { PublicConsultationCard } from '@/components/PublicConsultationCard';

const isUpcoming = (event: EventData) => {
  return new Date(event.calEvent.endDateTime).getTime() > new Date().getTime();
};

export async function PublicConsultationList() {
  const events = await fetchPublicConsultations();
  return (
    <div className="flex-col space-y-4 p-4 max-w-[1000px]">
      {events?.map(
        (event) =>
          isUpcoming(event) && (
            <PublicConsultationCard key={event.calEvent.recId} event={event} />
          ),
      )}
    </div>
  );
}
