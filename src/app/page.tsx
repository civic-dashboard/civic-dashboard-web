import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

type HomeCard = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  question: string;
  bullets: string[];
  ctaLabel: string;
  href: string;
};

const influenceCards: HomeCard[] = [
  {
    imageSrc: '/home/card-council-activity.webp',
    imageAlt: 'Council Activity background',
    title: 'Council Activity',
    question: "What's City Council up to?",
    bullets: [
      'Track current issues and meetings.',
      'Register to attend or speak on issues you care about.',
    ],
    ctaLabel: 'Explore Council Activity',
    href: '/actions',
  },
  {
    imageSrc: '/home/card-councillor-watch.webp',
    imageAlt: 'Councillor Watch background',
    title: 'Councillor Watch',
    question: "What's my Councillor's stance?",
    bullets: ['Find your councillor.', 'See their voting history.'],
    ctaLabel: 'Explore Councillor Watch',
    href: '/councillors',
  },
];

const understandCards: HomeCard[] = [
  {
    imageSrc: '/home/card-how-council-works.webp',
    imageAlt: 'How Council Works background',
    title: 'How Council Works',
    question: 'How does City Council work?',
    bullets: ['Understand council processes.', 'Know how to participate.'],
    ctaLabel: 'Learn about City Council',
    href: '/how-council-works',
  },
  {
    imageSrc: '/home/card-wiki.webp',
    imageAlt: 'Civic Dashboard Wiki background',
    title: 'Civic Dashboard Wiki',
    question: 'The Wiki',
    bullets: [
      'All your questions about City Council answered.',
      'A community wiki, built by volunteers.',
    ],
    ctaLabel: 'Browse the wiki',
    href: '/wiki',
  },
];

const avatars = [
  { src: '/home/avatar-1.png', alt: 'Volunteer profile 1' },
  { src: '/home/avatar-2.png', alt: 'Volunteer profile 2' },
  { src: '/home/avatar-3.png', alt: 'Volunteer profile 3' },
] as const;

function FeatureCard({ card }: { card: HomeCard }) {
  return (
    <article className="flex h-full flex-col gap-6">
      <div className="relative h-40 overflow-hidden sm:h-44">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          className="object-cover"
        />
        <h3 className="relative z-10 max-w-[90%] p-6 text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">
          {card.title}
        </h3>
      </div>

      <div className="space-y-4">
        <p className="border-b border-[#0d111724] pb-4 text-xl font-bold tracking-[-0.02em] text-[#0d1117]">
          {card.question}
        </p>
        <ul className="space-y-2">
          {card.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-base text-[#0d1117]"
            >
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-[#0057b8]"
                aria-hidden="true"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-1">
        <Link
          href={card.href}
          className="inline-flex min-h-10 items-center gap-2 border border-[#0057b8] px-3 py-2 text-sm font-semibold text-[#0057b8] transition-colors hover:bg-[#edf4ff]"
        >
          <span>{card.ctaLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function FeatureSection({
  title,
  cards,
  isMuted,
}: {
  title: string;
  cards: HomeCard[];
  isMuted?: boolean;
}) {
  return (
    <section
      className={isMuted ? 'bg-[var(--color-section-gray)]' : 'bg-white'}
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="space-y-12">
          <h2 className="text-3xl font-black leading-none tracking-[-0.01em] text-[#0d1117]">
            {title}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 md:px-12">
            {cards.map((card) => (
              <FeatureCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-[#0d1117]">
      <section className="bg-[var(--color-light-blue)] md:h-[470px]">
        <div className="mx-auto  max-w-5xl gap-8 px-4 pb-0 pt-0 sm:px-6 lg:px-8 relative">
          <div className="space-y-7 py-16 grid w-full gap-x-[100px] gap-y-0 lg:grid-cols-2">
            <h1 className="text-4xl font-black leading-none tracking-[-0.02em] text-[#0d1117] sm:text-5xl">
              Let&apos;s get a Toronto we love.
            </h1>
            <div className="h-px w-full md:col-span-2 bg-white/95" />
            <p className="text-lg leading-[1.5] text-[#0d1117]">
              Civic Dashboard was built by volunteers to help Torontonians
              follow and influence{' '}
              <span className="underline decoration-dotted underline-offset-4">
                Toronto City Council.
              </span>
            </p>
          </div>

          <div className="w-[486px] h-[470px] absolute top-0 right-10 bottom-0 hidden lg:block">
            <Image
              src="/home/hero-graphic.png"
              className=""
              alt="Toronto City Hall in downtown Toronto"
              fill
              priority
            />
          </div>
        </div>
      </section>

      <FeatureSection title="Help me influence" cards={influenceCards} />

      <FeatureSection
        title="Help me understand"
        cards={understandCards}
        isMuted
      />

      <section className="bg-[var(--color-light-blue)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[940px] space-y-6">
            <h2 className="text-3xl font-black leading-none tracking-[-0.01em] text-[#0d1117]">
              Help us make democracy more accessible.
            </h2>

            <div className="flex items-center justify-center pr-3">
              {avatars.map((avatar, index) => (
                <div
                  key={avatar.src}
                  className="relative -mr-3 h-8 w-8 overflow-hidden rounded-full border border-[#081058] bg-white"
                  style={{ zIndex: avatars.length - index }}
                >
                  <Image
                    src={avatar.src}
                    alt={avatar.alt}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="-mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#081058] bg-[#ebebeb] text-xs font-bold tracking-[-0.06em] text-[#0d1117]">
                20+
              </div>
            </div>

            <p className="text-base leading-[1.5] text-[#0d1117]">
              We&apos;re regular, passionate Torontonians building a better city
              together.
              <br />
              Join our volunteer team, stay informed by subscribing to our
              newsletter or give us feedback on how we can improve this product!
            </p>

            <div className="flex flex-col items-center justify-center gap-5 text-sm font-semibold text-[#081058] sm:flex-row sm:gap-10">
              <Link href="/feedback" className="hover:underline">
                Give us feedback
              </Link>
              <Link href="/join-newsletter" className="hover:underline">
                Sign up for the newsletter
              </Link>
              <Link
                href="/join"
                className="inline-flex min-h-10 items-center gap-2 border border-[#081058] px-4 py-2 hover:bg-[#81c3f7]"
              >
                <span>Join the team</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
