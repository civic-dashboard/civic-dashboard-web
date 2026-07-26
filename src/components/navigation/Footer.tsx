import {
  companyItems,
  iconItems,
  civicDashboardItems,
  resourceItems,
} from '@/constants/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from '../ExternalLink';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo + Message */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2>
                Tools to help you follow and influence Toronto City Council.
              </h2>
              <Image
                src="/logo.png"
                alt="Civic Dashboard Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div></div>
          </div>
          {/* Links Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Civic Dashboard */}
            <div className="space-y-4">
              <h3 className="text-l font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Civic Dashboard
              </h3>
              <ul className="space-y-3">
                {civicDashboardItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-blue-400 transition-colors duration-200 block"
                      {...(item.umamiEvent
                        ? { 'data-umami-event': item.umamiEvent }
                        : {})}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-l font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Resources
              </h3>

              <ul className="space-y-3">
                {resourceItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-blue-400 transition-colors duration-200 block"
                      {...(item.umamiEvent
                        ? { 'data-umami-event': item.umamiEvent }
                        : {})}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-l font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Company
              </h3>

              <ul className="space-y-3">
                {companyItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-blue-400 transition-colors duration-200 block"
                      {...(item.umamiEvent
                        ? { 'data-umami-event': item.umamiEvent }
                        : {})}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-12 pt-8 border-t border-gray-700/50 text-left">
          <div className="flex flex-row space-x-3">
            {iconItems.map((item) => (
              <ExternalLink
                key={item.icon}
                href={item.href}
                className="w-[26px] h-[26px] flex items-center justify-center"
                data-umami-event={item.umamiEvent}
              >
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={26}
                  height={26}
                  className="w-full h-full object-contain"
                />
              </ExternalLink>
            ))}
          </div>
          <p className="flex flex-start text-gray-400 col-span-1 md:col-span-3">
            This is an independent project powered by Toronto Open Data and
            built by volunteers at Civic Tech Toronto.
          </p>
        </div>
      </div>
    </footer>
  );
}
