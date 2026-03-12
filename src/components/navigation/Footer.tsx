import Image from 'next/image';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { ExternalLink } from '@/components/ExternalLink';

const civicLinks = [
  { label: 'Council Activity', href: '/actions' },
  { label: 'Councillor Watch', href: '/councillors' },
  { label: 'How Council Works', href: '/how-council-works' },
  { label: 'The Wiki', href: '/wiki' },
] as const;

const resourceLinks = [
  {
    label: 'Source code',
    href: 'https://github.com/civic-dashboard/civic-dashboard-web',
  },
  {
    label: 'Slack',
    href: 'https://civictechto.slack.com/archives/C06KU3DHEKV',
  },
  {
    label: 'Documentation',
    href: 'https://github.com/civic-dashboard/civic-dashboard-web#readme',
  },
] as const;

const companyLinks = [
  { label: 'About us', href: '/about', external: false },
  {
    label: 'Contact',
    href: 'mailto:teamcivicdashboard@gmail.com',
    external: true,
  },
  { label: 'Join us', href: '/join', external: false },
  {
    label: 'Sign up for newsletter',
    href: '/join-newsletter',
    external: false,
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#0057b8] text-white">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-white/25 pb-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-[460px] space-y-4">
            <Image
              src="/home/logo-footer.svg"
              alt="Civic Dashboard"
              width={36}
              height={49}
            />
            <p className="font-black leading-tight tracking-[-0.02em] text-white sm:text-[1.9rem]">
              Tools to help you follow and influence Toronto City Council.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-base font-semibold">Civic Dashboard</p>
              {civicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-base font-semibold">Resources</p>
              {resourceLinks.map((link) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  className="block text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </ExternalLink>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-base font-semibold">Company</p>
              {companyLinks.map((link) =>
                link.external ? (
                  <ExternalLink
                    key={link.href}
                    href={link.href}
                    className="block text-white/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </ExternalLink>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-white/90 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <ExternalLink
              href="https://bsky.app/profile/civicdashboard.bsky.social"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
            >
              <Image
                src="/bluesky.svg"
                alt="Bluesky"
                width={16}
                height={16}
                className="brightness-0 invert"
              />
            </ExternalLink>
            <ExternalLink
              href="https://www.linkedin.com/company/civic-dashboard/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={16}
                height={16}
                className="brightness-0 invert"
              />
            </ExternalLink>
            <ExternalLink
              href="https://github.com/civic-dashboard/civic-dashboard-web"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </ExternalLink>
            <ExternalLink
              href="https://civictechto.slack.com/archives/C06KU3DHEKV"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
            >
              <Image
                src="/slack.svg"
                alt="Slack"
                width={16}
                height={16}
                className="brightness-0 invert"
              />
            </ExternalLink>
          </div>

          <p className="text-xs text-white/85 sm:text-sm">
            This is an independent project powered by Toronto Open Data and
            built by volunteers at{' '}
            <ExternalLink
              href="https://civictech.ca/"
              className="underline decoration-dotted underline-offset-4"
            >
              Civic Tech Toronto
            </ExternalLink>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
