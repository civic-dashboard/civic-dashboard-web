'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/components/ui/text-items';
import { Tooltip, Provider as TooltipProvider } from '@/components/ui/tooltip';
import { tooltips } from '@/constants/tooltips';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HomeCard = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  question: string;
  bullets: [string, string];
  ctaLabel: string;
  href: string;
};

const influenceCards: HomeCard[] = [
  {
    imageSrc: '/home/feature-image-1.jpg',
    imageAlt: 'Council Activity',
    title: 'Council\nActivity',
    question: 'What\u2019s City Council up to?',
    bullets: [
      'Track current issues and meetings',
      'Register to attend or speak on issues you care about',
    ],
    ctaLabel: 'Explore Council Activity',
    href: '/actions',
  },
  {
    imageSrc: '/home/feature-image-2.jpg',
    imageAlt: 'Councillor Watch',
    title: 'Councillor\nWatch',
    question: 'What\u2019s my Councillor\u2019s stance?',
    bullets: ['Find your Councillor', 'See their voting history'],
    ctaLabel: 'Explore Councillor Watch',
    href: '/councillors',
  },
];

const understandCards: HomeCard[] = [
  {
    imageSrc: '/home/feature-image-3.jpg',
    imageAlt: 'How Council Works',
    title: 'How Council\nWorks',
    question: 'Learn the basics',
    bullets: [
      'Get to know Council processes',
      'Find out how you can participate',
    ],
    ctaLabel: 'Learn about City Council',
    href: '/how-council-works',
  },
  {
    imageSrc: '/home/feature-image-4.jpg',
    imageAlt: 'Civic Dashboard Wiki',
    title: 'Civic\nDashboard Wiki',
    question: 'Go deeper',
    bullets: [
      'Detailed guides, explanations, and resources',
      'A community wiki built by volunteers and continuously evolving',
    ],
    ctaLabel: 'Browse the wiki',
    href: '/wiki',
  },
];

function HomeCard({ card }: { card: HomeCard }) {
  return (
    <article className="flex flex-col gap-6 sm:gap-8">
      <div className="relative">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          width={600}
          height={200}
          className="w-full object-cover aspect-[5/1] sm:aspect-[3/1] lg:aspect-[4/1]"
        />
        <div className="top-0 bottom-0 absolute flex justify-start items-center w-full">
          <Text
            preset="Heading2"
            className="mb-0 p-4 md:p-6 text-white lg:leading-tight whitespace-nowrap sm:whitespace-pre-line"
          >
            {card.title}
          </Text>
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-4">
        <Text preset="Body" className="font-bold text-lg">
          {card.question}
        </Text>
        <ul className="flex flex-col gap-2">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check aria-hidden="true" size={16} className="mt-1" />
              <Text preset="Body">{bullet}</Text>
            </li>
          ))}
        </ul>
      </div>
      <Button variant="outline" size="lg" className="mr-auto" asChild>
        <Link href={card.href} data-umami-event={card.imageAlt}>
          <span>{card.ctaLabel}</span>
          <ArrowRight className="w-6 h-6" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

function HomeCardSection({
  title,
  cards,
}: {
  title: [string, string];
  cards: HomeCard[];
}) {
  return (
    <section>
      <div className="flex flex-col gap-6 sm:gap-12">
        <Text preset="Heading2" className="mb-0">
          {title[0]}
          <span className="font-normal">{' ' + title[1]}</span>
        </Text>
        <div className="gap-12 lg:gap-16 grid sm:grid-cols-2 mx-auto w-full">
          {cards.map((card) => (
            <HomeCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-white dark:bg-black">
      {/* Hero section */}
      <section className="bg-primary-light">
        <div className="sm:gap-4 lg:gap-16 grid grid-cols-1 sm:grid-cols-2 mx-auto px-4 sm:px-6 lg:px-16 max-w-6xl">
          <div className="flex flex-col justify-center pt-14 sm:pt-0">
            <div className="max-w-[544px]">
              <div className="max-w-[410px] text-black">
                <Text
                  preset="Heading1"
                  className="inline-block mb-0 text-balance"
                >
                  Let’s make a Toronto{' '}
                  <span className="inline-block relative pb-[0.65em] whitespace-nowrap">
                    we love.
                    <svg
                      aria-hidden="true"
                      className="right-0 bottom-0 absolute w-[100%] h-auto pointer-events-none"
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
                Civic Dashboard is built by volunteers to help Torontonians
                follow and influence{' '}
                <TooltipProvider>
                  <Tooltip
                    tooltipTitle={tooltips.cityCouncil.trigger}
                    tooltipContent={tooltips.cityCouncil.content}
                  >
                    Toronto City Council
                  </Tooltip>
                </TooltipProvider>
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
              className="w-auto h-[340px] sm:h-[360px] lg:h-[416px] lg:max-h-none"
            />
          </div>
        </div>
      </section>

      {/* Main content sections */}
      <div className="flex flex-col gap-24 mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-20 w-full max-w-6xl">
        <HomeCardSection
          title={['Help me influence', 'city council']}
          cards={influenceCards}
        />

        <HomeCardSection
          title={['Help me understand', 'city council']}
          cards={understandCards}
        />
      </div>

      <section className="flex justify-center bg-gray-lightest dark:bg-gray-darkest">
        <div className="flex md:flex-row flex-col gap-8 lg:gap-16 px-4 sm:px-6 lg:px-16 py-16 md:py-24 w-full max-w-6xl">
          <div className="grayscale max-w-[220px] md:max-w-none lg:max-w-[360px] grow-1">
            <Image
              src="/home/contributors-collage.jpg"
              alt="Civic Dashboard team"
              width={360}
              height={300}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="flex flex-col justify-center gap-2 lg:max-w-[660px] h-full grow-1">
            <Text preset="Heading2" className="max-w-[440px]">
              Help us make democracy more accessible.
            </Text>
            <Text preset="Body">
              We&apos;re regular, passionate Torontonians building a better city
              together.
            </Text>
            <Text preset="Body">
              Join our volunteer team, stay informed by subscribing to our
              newsletter or give us feedback on how we can improve this product!
            </Text>

            <div className="flex sm:flex-row flex-col sm:flex-wrap items-start gap-2 mt-8">
              <Button
                variant="outline"
                asChild
                className="border-black text-black"
              >
                <Link href="/feedback" data-umami-event="Feedback">
                  Give us feedback
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-black text-black"
              >
                <Link
                  href="/join-newsletter"
                  data-umami-event="Newsletter Signup"
                >
                  Sign up for the newsletter
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-black text-black"
              >
                <Link href="/join" data-umami-event="Join us">
                  Join the team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
