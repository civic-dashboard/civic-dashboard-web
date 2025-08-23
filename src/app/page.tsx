'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, Provider as TooltipProvider } from '@/components/ui/tooltip';
import { tooltips } from '@/constants/tooltips';
import { ExternalLink } from '@/components/ExternalLink';

export default function Home() {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section - with animation and gradient */}
        <section className="relative h-[650px] bg-gradient-to-br from-blue-900 to-purple-900">
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
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-6xl font-normal tracking-tight mb-4 animate-fade-in">
                Take Action on What's Happening at <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">
                  Toronto City Council
                </span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-light max-w-4xl leading-relaxed">
                Tools to help you follow, understand, and influence city
                decisions.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/actions"
                  className="inline-flex items-center justify-center px-6 py-[20px] whitespace-nowrap bg-white border-white text-xl text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  <span className="leading-none">
                    Take Action on City Issues
                  </span>
                </Link>

                <Link
                  href="/how-council-works"
                  className="inline-flex items-center justify-center px-6 py-[20px] whitespace-nowrap bg-transparent border-2 border-white text-white text-xl rounded-xl font-medium hover:bg-white/10 transition-all transform hover:scale-105"
                >
                  <span className="leading-none">Learn How Council Works</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-grow py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-normal mb-10 text-gray-900 dark:text-white">
                How to Use Civic Dashboard
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                It shouldn't take 3 hours and a political science degree to
                understand{' '}
                <Tooltip
                  tooltipTitle={tooltips.cityCouncil.trigger}
                  tooltipContent={tooltips.cityCouncil.content}
                >
                  City Council
                </Tooltip>{' '}
                and how to meaningfully engage with it. We make it take a few
                minutes.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20">
              {/* How Council Works Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  How Council Works
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Understand how city decisions are made. Use this page to learn
                  key terms and concepts to navigate City Council with
                  confidence.
                </p>
                <Link
                  href="/how-council-works"
                  className="inline-flex items-center justify-center px-6 py-[20px] w-full bg-[#6035C4] text-white text-xl rounded-xl font-medium"
                >
                  <span className="leading-none">Learn the basics</span>
                </Link>
              </div>

              {/* Actions Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Actions
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  See what decisions are coming up at Council and act on them in
                  one click. Use this page to subscribe to issues you care about
                  and speak up when ready.
                </p>
                <Link
                  href="/actions"
                  className="inline-flex items-center justify-center px-6 py-[20px] w-full bg-[#6035C4] text-white text-xl rounded-xl font-medium"
                >
                  <span className="leading-none">Find an issue to act on</span>
                </Link>
              </div>

              {/* Councillors Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Councillors
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Check how your{' '}
                  <Tooltip
                    tooltipTitle={tooltips.councillor.trigger}
                    tooltipContent={tooltips.councillor.content}
                  >
                    Councillor
                  </Tooltip>{' '}
                  votes and whether they represent your values. Use this page
                  when you're deciding how to advocate, follow up, or vote.
                </p>
                <Link
                  href="/councillors"
                  className="inline-flex items-center justify-center px-6 py-[20px] w-full bg-[#6035C4] text-white text-xl rounded-xl font-medium"
                >
                  <span className="leading-none">Find Your Councillor</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join us in making democracy more accessible
              </h2>
              <p className="text-white/90 text-lg mb-8">
                We're regular, passionate Torontonians building a better city
                together.
                <br />
                Join our volunteer team, or stay informed by subscribing to our
                newsletter.
              </p>
              <div className="flex flex-col sm:flex-row gap-[35px] justify-center">
                <Link
                  href="/join"
                  className="inline-flex items-center justify-center px-6 py-[20px] bg-white text-gray-900 text-xl rounded-xl font-medium"
                >
                  <span className="leading-none">Get Involved</span>
                </Link>
                <Link
                  href="/join-newsletter"
                  className="inline-flex items-center justify-center px-6 py-[20px] bg-transparent border-2 border-white text-white text-xl rounded-xl font-medium"
                >
                  <span className="leading-none">Sign Up for Updates</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-6">
                Check us out on these platforms!
              </h3>
              <div className="flex justify-center gap-6">
                <ExternalLink
                  href="https://www.linkedin.com/company/civic-dashboard/"
                  className="w-[26px] h-[26px] flex items-center justify-center"
                >
                  <Image
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    width={26}
                    height={26}
                    className="w-full h-full object-contain"
                  />
                </ExternalLink>
                <ExternalLink
                  href="https://bsky.app/profile/civicdashboard.bsky.social"
                  className="w-[26px] h-[26px] flex items-center justify-center"
                >
                  <Image
                    src="/bluesky.svg"
                    alt="Bluesky"
                    width={26}
                    height={26}
                    className="w-full h-full object-contain"
                  />
                </ExternalLink>
                <ExternalLink
                  href="https://civictechto.slack.com/archives/C06KU3DHEKV"
                  className="w-[26px] h-[26px] flex items-center justify-center"
                >
                  <Image
                    src="/slack.svg"
                    alt="Slack"
                    width={26}
                    height={26}
                    className="w-full h-full object-contain"
                  />
                </ExternalLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
