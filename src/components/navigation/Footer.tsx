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
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-400 transition-colors duration-200 block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/labs"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Labs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            {/* Contact Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Contact
              </h3>
              <ExternalLink
                href="mailto:teamcivicdashboard@gmail.com"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                teamcivicdashboard@gmail.com
              </ExternalLink>
            </div>

            {/* Resources (currently just privacy) */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Resources
              </h3>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="hover:text-blue-400 transition-colors duration-200"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
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
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Slack
              </ExternalLink>
              <ExternalLink
                href="https://www.linkedin.com/company/civic-dashboard/about/"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                LinkedIn
              </ExternalLink>
              <ExternalLink
                href="https://github.com/civic-dashboard"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </ExternalLink>
              <ExternalLink
                href="https://bsky.app/profile/civicdashboard.bsky.social"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Bluesky
              </ExternalLink>
            </div>

            <Link
              href="/join-newsletter"
              className="w-full block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-center"
            >
              Subscribe to Newsletter
            </Link>

            <ExternalLink
              href="https://civictech.ca/"
              className="block text-center py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              Civic Tech Toronto
            </ExternalLink>
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
