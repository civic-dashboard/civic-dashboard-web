'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heading1, Heading2 } from '@/components/ui/text-items';
import { ArrowRight, Check } from 'lucide-react';

type HomeCard = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  bullets: string[];
  ctaLabel: string;
  href: string;
};

const influenceCards: HomeCard[] = [
  {
    imageSrc: '/home/feature-image-activity.png',
    imageAlt: 'Council activity',
    title: 'Council \n Activity',
    bullets: [
      'See what council is discussing and deciding',
      'Track important issues',
      'Register to attend or speak on issues you care about',
    ],
    ctaLabel: 'Explore Council Activity',
    href: '/actions',
  },
  {
    imageSrc: '/home/feature-image-watch.png',
    imageAlt: 'Councillor watch',
    title: 'Councillor \n Watch',
    bullets: [
      'Find your councillor',
      'Follow how your councillor is voting',
      'See voting and attendance history',
    ],
    ctaLabel: 'Explore Councillor Watch',
    href: '/councillors',
  },
];

const understandCards: HomeCard[] = [
  {
    imageSrc: '/home/feature-image-get-started.png',
    imageAlt: 'How council works',
    title: 'How council \n works',
    bullets: [
      'Understand the basics of council processes',
      'Learn how you can participate',
    ],
    ctaLabel: 'Learn About City Council',
    href: '/how-council-works',
  },
  {
    imageSrc: '/home/feature-image-wiki.png',
    imageAlt: 'Civic dashboard wiki',
    title: 'Civic dashboard wiki',
    bullets: [
      'Detailed guides, explanations, and resources',
      'A community wiki built by volunteers, continuously evolving',
    ],
    ctaLabel: 'Browse the wiki',
    href: '/wiki',
  },
];

function HomeCard({ card }: { card: HomeCard }) {
  return (
    <article className="flex h-full flex-col gap-8">
      <div className="relative w-full ">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <p className="text-h1 text-white relative z-10 mb-0 p-4 md:p-6 whitespace-pre-line">
          {card.title}
        </p>
      </div>
      <div className="flex flex-col gap-8 justify-between h-full">
        <ul className="flex flex-col gap-2">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <Check
                aria-hidden="true"
                color="var(--foreground-muted)"
                size={16}
                className="mt-1"
              />
              <p className="text-body text-[var(--foreground)]">{bullet}</p>
            </li>
          ))}
        </ul>
        <Link href={card.href} className="button button-outline w-fit">
          <span>{card.ctaLabel}</span>
          <ArrowRight
            strokeWidth={1.5}
            className="h-6 w-6"
            aria-hidden="true"
          />
        </Link>
      </div>
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
    <section className="bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-2">
          <Heading2 className="mb-0 text-[var(--foreground)] pb-4 border-b border-[var(--muted-border)]">
            {title[0]} <span className="font-normal">{title[1]}</span>
          </Heading2>
        </div>
        <div className="mx-auto w-full grid gap-16 md:gap-16 max-w-5xl md:grid-cols-2">
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
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <section className="bg-[var(--primary-light)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-0 sm:px-16 md:flex-row xl:items-stretch xl:gap-16">
          <div className="flex flex-1 flex-col md:gap-6 justify-center py-16">
            <div className="inline-block md:w-[410px] flex-col gap-0">
              <Heading1 className="relative inline-block mb-0 pb-[39px] text-display text-[var(--black)]">
                Let’s make a
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
              Civic Dashboard is built by volunteers to help Torontonians follow
              and influence Toronto City Council.
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

      <div className="flex flex-col w-full max-w-7xl mx-auto gap-16 md:gap-24 px-4 sm:px-16 py-12 md:py-20">
        <HomeCardSection
          title={['Help me influence', 'city council']}
          cards={influenceCards}
        />

        <HomeCardSection
          title={['Help me understand', 'city council']}
          cards={understandCards}
        />
      </div>

      <section className="flex justify-center bg-[var(--background-shaded)]">
        <div className="w-full max-w-7xl flex flex-col gap-8 px-4 md:px-16 py-16 md:py-24 md:flex-row lg:gap-16">
          <div className="grow-1 max-w-[220px] md:max-w-none lg:max-w-[480px]">
            <Image
              src="/home/civ-dash.png"
              alt="Civic Dashboard team"
              width={428}
              height={372}
              className="object-contain"
            />
          </div>

          <div className="flex h-full flex-col gap-8 grow-1 lg:max-w-[660px]">
            <Heading2 className="mb-0 max-w-[440px]">
              Help us make democracy more accessible.
            </Heading2>
            <p className="text-body">
              We&apos;re regular, passionate Torontonians building a better city
              together.
              <br />
              Join our volunteer team, stay informed by subscribing to our
              newsletter or give us feedback on how we can improve this product!
            </p>

            <div className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap">
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
                <ArrowRight
                  strokeWidth={1.5}
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
