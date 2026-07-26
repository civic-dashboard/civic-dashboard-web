import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from '@/components/ExternalLink';
import { Text } from '@/components/ui/text-items';

const footerGroups = [
  {
    heading: 'Civic Dashboard',
    links: [
      { label: 'Actions', href: '/actions' },
      { label: 'Councillors', href: '/councillors' },
      { label: 'How Council works', href: '/how-council-works' },
      { label: 'The Wiki', href: '/wiki' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/civic-dashboard/civic-dashboard',
        external: true,
      },
      {
        label: 'Civic Tech Toronto',
        href: 'https://civictech.ca/',
        external: true,
      },
      { label: 'Privacy Policy', href: '/privacy' },
      {
        label: 'Analytics',
        href: 'https://eu.umami.is/share/6R9CNotgCUNEmDL5/civicdashboard.ca',
        external: true,
      },
    ],
  },
  {
    heading: 'Our Team',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Join us', href: '/join' },
      { label: 'Sign up for newsletter', href: '/join-newsletter' },
    ],
  },
] as const;

const socialLinks = [
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/civicdashboard.bsky.social',
    iconSrc: '/bluesky-logo-white.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/civic-dashboard/',
    iconSrc: '/linkedin-logo-white.svg',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/civic-dashboard',
    iconSrc: '/github-logo-white.svg',
  },
  {
    label: 'Slack',
    href: 'http://link.civictech.ca/slack',
    iconSrc: '/slack-logo-white.svg',
  },
] as const;

type FooterLink = (typeof footerGroups)[number]['links'][number];

function FooterNavLink({ link }: { link: FooterLink }) {
  if ('external' in link && link.external) {
    return (
      <ExternalLink href={link.href}>
        <Text preset="Small" tag="span" className="text-white">
          {link.label}
        </Text>
      </ExternalLink>
    );
  }

  return (
    <Link href={link.href}>
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
              <ExternalLink href="mailto:teamcivicdashboard@gmail.com">
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
