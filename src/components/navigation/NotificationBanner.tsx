'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotificationBanner({
  message,
  link,
}: {
  message: string;
  link: string;
}) {
  const pathname = usePathname();
  const isRouteActive = pathname === link;
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <div className="w-full z-50">
      {!isRouteActive && !isDismissed ? (
        <div className="bg-orange-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <Link href={link} className="w-fit">
              <p className="text-md font-semibold">{message}</p>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="ml-4 flex-shrink-0 text-white hover:text-gray-200 transition-colors"
              aria-label="Collapse notification"
            >
              Hide
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
