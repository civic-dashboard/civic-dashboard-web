import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from '@/components/ExternalLink';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const sitemapSections: Array<{
  title: string;
  links: FooterLink[];
}> = [
  {
    title: 'Civic Dashboard',
    links: [
      { label: 'Council Activity', href: '/actions' },
      { label: 'Councillor Watch', href: '/councillors' },
      { label: 'How Council works', href: '/how-council-works' },
      { label: 'The Wiki', href: '/wiki' },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/civic-dashboard',
        external: true,
      },
      {
        label: 'Slack',
        href: 'https://civictechto.slack.com/archives/C06KU3DHEKV',
        external: true,
      },
      { label: 'Documentation', href: '/wiki' },
      {
        label: 'Civic Tech Toronto',
        href: 'https://civictech.ca/',
        external: true,
      },
    ],
  },
  {
    title: 'Our Team',
    links: [
      { label: 'About us', href: '/about' },
      {
        label: 'Contact',
        href: 'mailto:teamcivicdashboard@gmail.com',
        external: true,
      },
      { label: 'Join us', href: '/join' },
      { label: 'Sign up for newsletter', href: '/join-newsletter' },
    ],
  },
];

const socialLinks = [
  {
    label: 'Bluesky',
    href: 'https://bsky.app/profile/civicdashboard.bsky.social',
    iconSrc: '/bluesky-logo-white.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/civic-dashboard/about/',
    iconSrc: '/linkedin-logo-white.svg',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/civic-dashboard',
    iconSrc: '/github-logo-white.svg',
  },
  {
    label: 'Slack',
    href: 'https://civictechto.slack.com/archives/C06KU3DHEKV',
    iconSrc: '/slack-logo-white.svg',
  },
] satisfies ReadonlyArray<{ label: string; href: string; iconSrc: string }>;

const footerLinkClassName =
  'text-small text-white transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm';

function FooterNavLink({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <ExternalLink href={link.href} className={footerLinkClassName}>
        {link.label}
      </ExternalLink>
    );
  }

  return (
    <Link href={link.href} className={footerLinkClassName}>
      {link.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-8 lg:px-16 lg:py-[100px]">
        <div className="grid w-full gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-h2 max-w-[400px] text-white">
              Tools to help you follow and influence Toronto City Council.
            </h2>
            <Image
              src="/logo.png"
              alt="Civic Dashboard logo"
              width={36}
              height={49}
              className="h-[49px] w-[36px] object-contain"
            />
          </div>
          <nav
            aria-label="Footer sitemap"
            className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-4"
          >
            {sitemapSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-button text-white">{section.title}</h3>
                <ul className="flex flex-col gap-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="h-px w-full bg-white/30" />

        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-2">
            {socialLinks.map((socialLink) => (
              <ExternalLink
                key={socialLink.label}
                href={socialLink.href}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <Image
                  src={socialLink.iconSrc}
                  alt={socialLink.label}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </ExternalLink>
            ))}
          </div>
          <p className="text-small max-w-[455px] text-white">
            This is an independent project powered by Toronto Open Data and
            built by volunteers at Civic Tech Toronto.
          </p>
        </div>
      </div>
    </footer>
  );
}
