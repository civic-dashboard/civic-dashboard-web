import { EventList } from '@/components/EventList';
import { ItemList } from '@/components/ItemList';

export default function Home() {
  return (
    <div className="flex flex-row bg-white">
      <div className="w-1/2 m-4">
        <h1>Upcoming Agenda Items</h1>
        <ItemList />
      </div>
      <div className="w-1/2 m-4">
        <h1>Public Consultations</h1>
        <EventList />
      </div>
    </div>
  );
}
