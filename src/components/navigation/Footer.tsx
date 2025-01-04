import { menuItems } from '@/constants/navigation';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Navigation Links Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-blue-400 transition-colors duration-200 block"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Contact
            </h3>
            <p className="hover:text-blue-400 transition-colors duration-200">
              teamcivicdashboard@gmail.com
            </p>
          </div>

          {/* Legal Links Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Stay Connected
            </h3>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Twitter
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/civic-dashboard"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Subscribe to Newsletter
            </button>

            <a
              href="https://civictech.ca/"
              className="block text-center py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
            >
              Civic Tech Toronto
            </a>
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
