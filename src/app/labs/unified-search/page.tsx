import { SearchInterface } from '@/app/labs/unified-search/SearchInterface';
import { PrototypeNotice } from '@/app/labs/PrototypeNotice';

export default function Home() {
  return (
    <div className="mx-auto max-w-max-content-width min-h-screen flex flex-col items-center">
      <PrototypeNotice>
        This is an experimental search UI, exploring the idea of searching over
        different kinds of data in one place!
      </PrototypeNotice>
      <SearchInterface />
    </div>
  );
}
