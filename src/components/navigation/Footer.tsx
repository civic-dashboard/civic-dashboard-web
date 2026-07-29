import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';
import { Text } from '@/components/ui/text-items';

const footerGroups = [
  {
    heading: 'Civic Dashboard',
    links: [
      { label: 'Actions', href: '/actions', umamiEvent: 'Council Activity' },
      {
        label: 'Councillors',
        href: '/councillors',
        umamiEvent: 'Councillor Watch',
      },
      {
        label: 'How Council works',
        href: '/how-council-works',
        umamiEvent: 'How Council Works',
      },
      { label: 'The Wiki', href: '/wiki', umamiEvent: 'The Wiki' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/civic-dashboard/civic-dashboard',
        external: true,
        umamiEvent: 'GitHub',
      },
      {
        label: 'Civic Tech Toronto',
        href: 'https://civictech.ca/',
        external: true,
        umamiEvent: 'Civic Tech Toronto',
      },
      {
        label: 'Privacy Policy',
        href: '/privacy',
        umamiEvent: 'Privacy Policy',
      },
      {
        label: 'Analytics',
        href: 'https://eu.umami.is/share/6R9CNotgCUNEmDL5/civicdashboard.ca',
        external: true,
        umamiEvent: 'Analytics',
      },
    ],
  },
  {
    heading: 'Our Team',
    links: [
      { label: 'About us', href: '/about', umamiEvent: 'About us' },
      { label: 'Join us', href: '/join', umamiEvent: 'Join us' },
      {
        label: 'Sign up for newsletter',
        href: '/join-newsletter',
        umamiEvent: 'Newsletter Signup',
      },
    ],
  },
] as const;

const socialLinks = [
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/civicdashboard.bsky.social',
    iconSrc: '/bluesky-logo-white.svg',
    umamiEvent: 'Bluesky',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/civic-dashboard/',
    iconSrc: '/linkedin-logo-white.svg',
    umamiEvent: 'LinkedIn',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/civic-dashboard',
    iconSrc: '/github-logo-white.svg',
    umamiEvent: 'GitHub',
  },
  {
    label: 'Slack',
    href: 'http://link.civictech.ca/slack',
    iconSrc: '/slack-logo-white.svg',
    umamiEvent: 'Slack',
  },
] as const;

type FooterLink = (typeof footerGroups)[number]['links'][number];

function FooterNavLink({ link }: { link: FooterLink }) {
  const umamiEvent = 'umamiEvent' in link ? link.umamiEvent : undefined;

  if ('external' in link && link.external) {
    return (
      <ExternalLink href={link.href} data-umami-event={umamiEvent}>
        <Text preset="Small" tag="span" className="text-white">
          {link.label}
        </Text>
      </ExternalLink>
    );
  }

  return (
    <Link href={link.href} data-umami-event={umamiEvent}>
      <Text preset="Small" tag="span" className="text-white">
        {link.label}
      </Text>
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-16 md:gap-10 md:px-8 md:py-24 lg:px-16">
        <div className="flex flex-col gap-8 md:gap-10 lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-3">
            <Text preset="Heading2" className="mb-0 max-w-[400px]">
              Tools to help you follow and influence Toronto City Council.
            </Text>
            <Image
              src="/footer-logo.svg"
              alt="Civic Dashboard logo"
              width={36}
              height={49}
              className="h-[49px] w-9 object-contain"
            />
          </div>

          <div className="grid gap-x-4 gap-y-8 md:grid-cols-3 md:gap-y-8">
            {footerGroups.map((group) => (
              <div key={group.heading} className="flex flex-col gap-1">
                <Text preset="Body" tag="h3" className="font-semibold mb-1">
                  {group.heading}
                </Text>
                <div className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <FooterNavLink key={link.label} link={link} />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-2 md:col-span-3">
              <Text preset="Body" tag="h3" className="font-semibold mb-1">
                Email
              </Text>
              <ExternalLink
                href="mailto:teamcivicdashboard@gmail.com"
                data-umami-event="Contact"
              >
                <Text preset="Small" tag="span" className="text-white">
                  teamcivicdashboard@gmail.com
                </Text>
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/20" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <ExternalLink
                key={link.label}
                href={link.href}
                aria-label={link.label}
                data-umami-event={link.umamiEvent}
              >
                <Image
                  src={link.iconSrc}
                  alt={`${link.label} logo`}
                  width={32}
                  height={32}
                  className="size-8"
                />
              </ExternalLink>
            ))}
          </div>

          <Text preset="Small" className="max-w-[455px]">
            This is an independent project powered by Toronto Open Data and
            built by volunteers at Civic Tech Toronto.
          </Text>
        </div>
      </div>
    </footer>
  );
}
