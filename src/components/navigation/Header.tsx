'use client';
import { useEffect, useRef, useState } from 'react';
import { menuItems } from '@/constants/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text-items';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import ElectionBanner from '@/components/ElectionBanner';

// We need to declare the border classes for each color variant.
// We apply these class names dynamically, so we need to declare them here to ensure they are included in the final CSS bundle.
const borderClassByColor: Record<string, string> = {
  success: 'border-success',
  warning: 'border-warning',
  danger: 'border-danger',
  primary: 'border-primary',
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const desktopMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openDesktopMenu) return;

    const closeMenu = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !desktopMenuRef.current?.contains(event.target)
      ) {
        setOpenDesktopMenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDesktopMenu(null);
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openDesktopMenu]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 64rem)');
    const closeMenuOnDesktop = () => {
      if (desktopQuery.matches) setIsMenuOpen(false);
    };

    closeMenuOnDesktop();
    desktopQuery.addEventListener('change', closeMenuOnDesktop);
    return () =>
      desktopQuery.removeEventListener('change', closeMenuOnDesktop);
  }, []);

  return (
    <div
      className={
        isMenuOpen
          ? 'max-lg:fixed max-lg:inset-0 max-lg:z-30 max-lg:flex max-lg:flex-col max-lg:bg-white lg:contents dark:max-lg:bg-black'
          : 'contents'
      }
    >
      <div className="shrink-0">
        <ElectionBanner />
      </div>
      <header className="sticky top-0 z-30 shrink-0 bg-white dark:bg-black">
        <nav
          ref={desktopMenuRef}
          className="relative max-w-7xl py-2 mx-auto px-4 sm:px-6 lg:px-8 lg:py-4"
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2"
                data-umami-event="Header navigation: Home"
              >
                <Image
                  src="/logo.png"
                  alt="Civic Dashboard Logo"
                  width={33}
                  height={46}
                  className="object-contain h-7.5 md:h-11 w-auto"
                />
                <Text
                  preset="Heading2"
                  tag="span"
                  className="mb-0 tracking-tight"
                >
                  Civic Dashboard
                </Text>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              {menuItems.map((item) => {
                const isOpen = openDesktopMenu === item.slug;

                return (
                  <Button
                    key={item.label}
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setOpenDesktopMenu(isOpen ? null : item.slug)
                    }
                    data-umami-event={`Header navigation: ${item.label}`}
                    aria-expanded={isOpen}
                    aria-controls={`${item.slug}-menu`}
                    className={`border-black text-black  ${isOpen ? 'bg-primary-lightest dark:bg-white/10' : ''}`}
                  >
                    {item.label}
                    <ChevronDown className={`h-6 w-6`} aria-hidden="true" />
                  </Button>
                );
              })}
            </div>

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden flex items-center py-2">
              <Button
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                variant="outline"
                size="icon"
                className="text-black border-black"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                data-umami-event={`Header navigation: ${
                  isMenuOpen ? 'Close menu' : 'Open menu'
                }`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {openDesktopMenu && (
            <div
              id={`${openDesktopMenu}-menu`}
              className={`absolute right-0 top-full z-20 hidden w-auto lg:block ${
                openDesktopMenu === 'our-tools' ? '-translate-x-8' : '' // For slight visual diff of the menus
              }`}
            >
              <div className="mx-auto max-w-4xl border border-gray-light bg-white py-8 px-6 shadow-md dark:border-gray-dark dark:bg-black">
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {menuItems
                    .find((item) => item.slug === openDesktopMenu)
                    ?.subItems.map((subItem, index) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        target={subItem.newTab ? '_blank' : '_self'}
                        onClick={() => setOpenDesktopMenu(null)}
                        data-umami-event={`Header navigation: ${subItem.label}`}
                        className={`flex flex-col gap-2 px-4 py-2 hover:bg-primary-lightest dark:hover:bg-primary/20 ${
                          index === 4 ? 'col-span-2' : ''
                        } ${
                          subItem.borderColor
                            ? `border-l-4 ${borderClassByColor[subItem.borderColor]}`
                            : ''
                        }`}
                      >
                        <Text preset="Body" tag="h3" className="font-semibold">
                          {subItem.label}
                        </Text>
                        <Text
                          preset="Small"
                          className="text-gray-dark dark:text-gray-light"
                        >
                          {subItem.description}
                        </Text>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile/Tablet Menu - moved outside header */}
      {isMenuOpen && (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4 lg:hidden">
          <Accordion
            type="single"
            collapsible
            defaultValue={menuItems[0].label}
            className="w-full flex flex-col gap-4"
          >
            {menuItems.map((item) => (
              <AccordionItem
                key={item.label}
                value={item.label}
                className="border-gray-light dark:border-white/10"
              >
                <AccordionTrigger
                  variant="heading"
                  className="data-[state=open]:bg-primary-lightest data-[state=open]:dark:bg-primary py-4"
                  data-umami-event={`Header navigation: ${item.label}`}
                >
                  {item.label}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 px-2 pt-3">
                    {item.subItems.map((subItem) => (
                      <Link
                        onClick={() => setIsMenuOpen(false)}
                        key={subItem.label}
                        href={subItem.href}
                        target={subItem.newTab ? '_blank' : '_self'}
                        className={`flex flex-col border-l-4 px-4 py-2 gap-1 ${
                          subItem.borderColor
                            ? (borderClassByColor[subItem.borderColor] ??
                              'border-transparent')
                            : 'border-transparent'
                        }`}
                        data-umami-event={`Header navigation: ${subItem.label}`}
                      >
                        <Text preset="Body" tag="h3" className="font-semibold">
                          {subItem.label}
                        </Text>
                        <Text
                          preset="Small"
                          className="text-gray-dark dark:text-gray-light"
                        >
                          {subItem.description}
                        </Text>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
