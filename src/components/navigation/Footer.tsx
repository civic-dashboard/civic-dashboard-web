import { menuItems } from '@/constants/navigation';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links Column */}
          <div className="space-y-4">
            <h3 className="text-h3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body hover:text-blue-400 transition-colors duration-200 block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/labs"
                  className="text-body hover:text-blue-400 transition-colors duration-200"
                >
                  Labs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-h3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Contact
              </h3>
              <ExternalLink
                href="mailto:teamcivicdashboard@gmail.com"
                className="text-body hover:text-blue-400 transition-colors duration-200"
              >
                teamcivicdashboard@gmail.com
              </ExternalLink>
            </div>

            {/* Resources (currently just privacy) */}
            <div className="space-y-4">
              <h3 className="text-h3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Resources
              </h3>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-body hover:text-blue-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="text-body hover:text-blue-400 transition-colors duration-200"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-h3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Stay Connected
            </h3>
            <div className="flex space-x-6">
              {/* <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Twitter
              </a> */}
              <ExternalLink
                href="https://civictechto.slack.com/archives/C06KU3DHEKV"
                className="text-body hover:text-blue-400 transition-colors duration-200"
              >
                Slack
              </ExternalLink>
              <ExternalLink
                href="https://www.linkedin.com/company/civic-dashboard/about/"
                className="text-body hover:text-blue-400 transition-colors duration-200"
              >
                LinkedIn
              </ExternalLink>
              <ExternalLink
                href="https://github.com/civic-dashboard"
                className="text-body hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </ExternalLink>
              <ExternalLink
                href="https://bsky.app/profile/civicdashboard.bsky.social"
                className="text-body hover:text-blue-400 transition-colors duration-200"
              >
                Bluesky
              </ExternalLink>
            </div>
            <div className="flex flex-col space-y-3">
              <Link
                href="/join-newsletter"
                className="button button-solid  w-full"
              >
                Subscribe to Newsletter
              </Link>

              <ExternalLink
                href="https://civictech.ca/"
                className="button button-outline-white w-full"
              >
                Civic Tech Toronto
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Civic Dashboard. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
