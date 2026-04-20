'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  DisplayText,
  Heading1,
  Heading2,
  Heading3,
} from '@/components/ui/text-items';
import { ArrowRight, Check } from 'lucide-react';

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
    imageSrc: '/home/feature-image-activity.png',
    imageAlt: 'Council activity',
    title: 'Council Activity',
    question: 'What\u2019s City Council up to?',
    bullets: [
      'Track current issues and meetings.',
      'Register to attend or speak on issues you care about.',
    ],
    ctaLabel: 'Explore Council Activity',
    href: '/actions',
  },
  {
    imageSrc: '/home/feature-image-watch.png',
    imageAlt: 'Councillor watch',
    title: 'Councillor Watch',
    question: 'What\u2019s my Councillor\u2019s stance?',
    bullets: ['Find your councillor.', 'See their voting history.'],
    ctaLabel: 'Explore Councillor Watch',
    href: '/councillors',
  },
];

const understandCards: HomeCard[] = [
  {
    imageSrc: '/home/feature-image-get-started.png',
    imageAlt: 'How city council works',
    title: 'Get started',
    question: 'How does City Council work?',
    bullets: [
      'Understand the basics of council processes.',
      'Learn how you can participate.',
    ],
    ctaLabel: 'Learn about City Council',
    href: '/how-council-works',
  },
  {
    imageSrc: '/home/feature-image-wiki.png',
    imageAlt: 'Civic dashboard wiki',
    title: 'Expand your knowledge',
    question: 'Civic Dashboard Wiki',
    bullets: [
      'Detailed guides, explanations, & resources.',
      'A community wiki built volunteers, continuously evolving.',
    ],
    ctaLabel: 'Browse the wiki',
    href: '/wiki',
  },
];

function HomeCard({ card }: { card: HomeCard }) {
  return (
    <article className="flex h-full flex-col gap-8">
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '3 / 1' }}
      >
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <DisplayText className="relative z-10 mb-0 max-w-[90%] p-4 text-[var(--white)] md:p-6">
          {card.title}
        </DisplayText>
      </div>

      <div className="flex flex-col gap-4">
        <Heading3 className="mb-0 border-b border-[rgba(13,17,23,0.14)] pb-[15px] text-[var(--black)]">
          {card.question}
        </Heading3>
        <ul className="flex flex-col gap-2">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check
                aria-hidden="true"
                color="var(--grey-dark)"
                size={16}
                className="mt-1"
              />
              <p className="text-body text-[var(--black)]">{bullet}</p>
            </li>
          ))}
        </ul>
      </div>

      <Link href={card.href} className="button button-outline w-fit gap-6">
        <span>{card.ctaLabel}</span>
        <ArrowRight className="h-6 w-6" aria-hidden="true" />
      </Link>
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
    <section className="bg-[var(--white)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 md:px-16 py-16 sm:px-16">
        <div className="flex flex-col gap-2">
          <Heading2 className="mb-0 text-[var(--black)]">
            {title[0]} <span className="font-normal">{title[1]}</span>
          </Heading2>
        </div>
        <div className="grid gap-12 lg:px-12 sm:grid-cols-2 lg:gap-16">
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
    <main className="bg-[var(--white)] text-[var(--black)]">
      <section className="bg-[var(--primary-light)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-0 sm:px-16 md:flex-row xl:items-stretch xl:gap-16">
          <div className="flex flex-1 flex-col md:gap-6 justify-center py-16">
            <div className="inline-block md:w-[410px] flex-col gap-0">
              <Heading1 className="relative inline-block mb-0 pb-[39px] text-display text-[var(--black)]">
                Let’s get a
                <br />
                Toronto
                <span className="relative">
                  {' '}
                  we love.
                  <Image
                    src="/squiggle.svg"
                    alt=""
                    width={222}
                    height={39}
                    aria-hidden="true"
                    className="absolute -bottom-[39px] right-0 h-6 w-auto"
                  />
                </span>
              </Heading1>
            </div>
            <p className="text-body max-w-[604px] text-[var(--black)]">
              Civic Dashboard was built by volunteers to help Torontonians
              follow and influence Toronto City Council.
            </p>
          </div>

          <Image
            src="/home/hero-graphic.png"
            alt="Toronto city hall"
            width={554}
            height={430}
            sizes="(max-width: 1279px) 100vw, 554px"
            priority
            className="w-full max-w-[554px] object-contain"
          />
        </div>
      </section>

      <HomeCardSection
        title={['Help me influence', 'city council']}
        cards={influenceCards}
      />

      <HomeCardSection
        title={['Help me understand', 'city council']}
        cards={understandCards}
      />

      <section className="flex justify-center bg-[var(--grey-lightest)]">
        <div className="flex w-full max-w-7xl flex-col items-center gap-8 px-4 md:px-16 py-16 md:py-24 md:flex-row">
          <Image
            src="/home/civ-dash.png"
            alt="Civic Dashboard team"
            width={428}
            height={372}
            sizes="(max-width: 1279px) 100vw, 428px"
            className="w-full max-w-[428px] object-contain"
          />

          <div className="flex w-full h-full flex-1 flex-col gap-8">
            <Heading2 className="mb-0 max-w-[441px] text-[var(--black)]">
              Help us make democracy more accessible.
            </Heading2>
            <p className="text-body max-w-[940px] text-[var(--black)]">
              We&apos;re regular, passionate Torontonians building a better city
              together.
              <br />
              Join our volunteer team, stay informed by subscribing to our
              newsletter or give us feedback on how we can improve this product!
            </p>

            <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/feedback"
                className="button button-ghost text-[var(--black)]"
              >
                Give feedback
              </Link>
              <Link
                href="/join-newsletter"
                className="button button-ghost text-[var(--black)]"
              >
                Sign up for newsletter
              </Link>
              <Link href="/join" className="button button-outline">
                <span>Join the team</span>
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
