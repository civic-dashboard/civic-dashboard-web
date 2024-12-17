import { PublicConsultationList } from '@/components/PublicConsultationList';

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <PublicConsultationList />
    </div>
  );
}
