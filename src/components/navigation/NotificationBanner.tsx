'use client';
import { useState, useEffect } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (pathname === link) {
      setIsCollapsed(true);
    }
  }, [pathname, link]);

  return (
    <div className="w-full">
      {!isCollapsed ? (
        <div className="bg-orange-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <Link href={link} className="w-fit">
              <p className="text-md font-semibold">{message}</p>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(true);
              }}
              className="ml-4 flex-shrink-0 text-white hover:text-gray-200 transition-colors"
              aria-label="Collapse notification"
            >
              Hide
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-16 right-3 bg-orange-400 text-white mt-3 w-8 h-8 flex items-center justify-center rounded-full shadow-lg z-50"
          aria-label="Show notification"
        >
          ❤️
        </button>
      )}
    </div>
  );
}
