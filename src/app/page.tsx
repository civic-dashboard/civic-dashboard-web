'use client';
import Image from 'next/image';
import { menuItems } from '@/constants/navigation';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - with animation and gradient */}
      <section className="relative h-[80vh] bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Toronto Skyline"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-purple-900/60 animate-[gradient_8s_ease_infinite]"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in">
              Know what&apos;s happening in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Toronto City Council
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-light max-w-3xl leading-relaxed">
              An accessible democracy is a functioning democracy
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/about"
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Learn More
              </a>
              <a
                href="/join"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Get Involved
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              The Civic Dashboard Project
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              It shouldn&apos;t take 3 hours and a political science degree to
              understand City Council and how to meaningfully engage with it. We
              make it take a few minutes.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                title: 'How Council Works',
                description:
                  "Clear, concise explanation of how Toronto's City Council works",
                icon: '📚',
                menuLink: 'How Council Works',
              },
              {
                title: 'Search',
                description:
                  'Precise search for all Council items relevant to your interests',
                icon: '🔍',
                menuLink: 'Search',
              },
              {
                title: 'Actions',
                description:
                  'Find and take action on relevant items in one click',
                icon: '✨',
                menuLink: 'Actions',
              },
              {
                title: 'Councillors',
                description:
                  "See your Councillor's voting record and alignment",
                icon: '👥',
                menuLink: 'Councillors',
              },
            ].map((feature) => {
              const menuItem = menuItems.find(
                (item) => item.label === feature.menuLink,
              );
              return (
                <a
                  key={feature.title}
                  href={menuItem?.href}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </a>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join us in making democracy more accessible
            </h2>
            <p className="text-white/90 text-lg mb-8">
              We&apos;re regular, passionate Torontonians building a better city
              together
            </p>
            <a
              href="/join"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Get Involved
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
