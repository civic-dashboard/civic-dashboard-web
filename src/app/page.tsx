'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/ui/text-items';
import { Tooltip, Provider as TooltipProvider } from '@/components/ui/tooltip';
import { tooltips } from '@/constants/tooltips';
import { ExternalLink } from '@/components/ExternalLink';

export default function Home() {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <section className="bg-primary-light">
          <div className="mx-auto grid max-w-7xl grid-cols-1 px-6 sm:grid-cols-2 sm:px-8 sm:gap-4 lg:gap-16 lg:px-16">
            <div className="flex flex-col justify-center pt-14 sm:pt-0">
              <div className="max-w-[544px]">
                <div className="max-w-[410px] text-black">
                  <Text
                    preset="Heading1"
                    tag="p"
                    className="mb-0 inline-block text-balance"
                  >
                    Let&apos;s get a Toronto{' '}
                    <span className="relative inline-block whitespace-nowrap pb-[0.65em]">
                      we love.
                      <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 right-0 h-auto w-[100%]"
                        viewBox="0 0 217 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 10C65 1 153 1 203 7C224 10 210 15 185 17C136 21 94 22 72 25C49 28 51 34 88 33"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </Text>
                </div>
                <Text preset="Body" className="mt-6 max-w-[544px] text-black">
                  Civic Dashboard was built by volunteers to help Torontonians
                  follow and influence{' '}
                  <Tooltip
                    tooltipTitle={tooltips.cityCouncil.trigger}
                    tooltipContent={tooltips.cityCouncil.content}
                  >
                    Toronto City Council
                  </Tooltip>
                  .
                </Text>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/city-hall-stylized.png"
                alt="Toronto City Hall"
                width={319}
                height={416}
                priority
                className="h-[340px] w-auto sm:h-[360px] lg:h-[416px] lg:max-h-none"
              />
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
                  and speak up when they come up.
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
                  <span className="leading-none">Find your councillor</span>
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
