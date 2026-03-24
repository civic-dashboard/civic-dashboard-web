'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { menuItems } from '@/constants/navigation';

const ctaLinks = [
  { label: 'Explore and act', href: '/actions' },
  { label: 'About this project', href: '/about' },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#d5d9df] bg-white">
        <nav className="mx-auto flex h-[86px] w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-[#0d1117]"
            aria-label="Civic Dashboard home"
          >
            <Image
              src="/home/logo-header.svg"
              alt="Civic Dashboard"
              width={33}
              height={46}
              priority
            />
            <span className="font-(font-heading) text-xl font-black font-sans leading-none tracking-[-0.03em] sm:text-2xl">
              Civic Dashboard
            </span>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            {ctaLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#081058] px-5 py-2 text-sm font-semibold text-[#081058] transition-colors hover:bg-[#f2f6ff]"
              >
                <span>{link.label}</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-[#081058] text-[#081058] transition-colors hover:bg-[#f2f6ff] lg:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0d1117]/35"
            aria-label="Close navigation menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6">
            <div className="mb-6 flex items-center justify-between border-b border-[#d5d9df] pb-4">
              <span className="text-lg font-black tracking-[-0.02em] text-[#0d1117]">
                Civic Dashboard
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center border border-[#081058] text-[#081058]"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 border-b border-[#d5d9df] pb-5">
              {ctaLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-10 items-center justify-between border border-[#081058] px-4 py-2 text-sm font-semibold text-[#081058]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-1 py-2 text-base font-medium text-[#0d1117] transition-colors hover:text-[#0057b8]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
