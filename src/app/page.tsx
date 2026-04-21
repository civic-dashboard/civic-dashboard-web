'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heading1, Heading2, Heading3 } from '@/components/ui/text-items';
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
    title: 'Council \n Activity',
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
    title: 'Councillor \n Watch',
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
    title: 'Get \n started',
    question: 'How does City Council work?',
    bullets: [
      'Understand the basics of council processes.',
      'Learn how you can participate.',
    ],
    ctaLabel: 'Learn about \n City Council',
    href: '/how-council-works',
  },
  {
    imageSrc: '/home/feature-image-wiki.png',
    imageAlt: 'Civic dashboard wiki',
    title: 'Expand your \n knowledge',
    question: 'Civic Dashboard Wiki',
    bullets: [
      'Detailed guides, explanations, & resources.',
      'A community wiki built volunteers, continuously evolving.',
    ],
    ctaLabel: 'Browse \n the wiki',
    href: '/wiki',
  },
];

function HomeCard({ card }: { card: HomeCard }) {
  return (
    <article className="flex h-full flex-col gap-8">
      <div className="relative w-full overflow-hidden">
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

      <div className="flex flex-col gap-4">
        <Heading3 className="mb-0 border-b border-[rgba(13,17,23,0.14)] pb-4">
          {card.question}
        </Heading3>
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
    <section className="bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 ">
        <div className="flex flex-col gap-2">
          <Heading2 className="mb-0 text-[var(--foreground)]">
            {title[0]} <span className="font-normal">{title[1]}</span>
          </Heading2>
        </div>
        <div className="mx-auto w-full grid gap-12 max-w-5xl sm:grid-cols-2 lg:gap-16">
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

      <div className="flex flex-col w-full max-w-7xl mx-auto gap-24 px-4 sm:px-16 py-12 md:py-20">
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
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
