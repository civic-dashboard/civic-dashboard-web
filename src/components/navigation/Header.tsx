'use client';
import { useEffect, useRef, useState } from 'react';
import { menuItems } from '@/constants/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import NotificationBanner from '@/components/navigation/NotificationBanner';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text-items';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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

  return (
    <>
      <NotificationBanner
        message="We love and need your feedback! Tap to share your thoughts."
        link="/feedback"
      />
      <header className="sticky top-0 z-10 bg-white dark:bg-black">
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
                  className="object-contain h-[30px] md:h-[44px] w-auto"
                />
                <Text
                  preset="Heading2"
                  tag="h1"
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
        <div className="fixed inset-x-0 bottom-0 top-16 z-[9] flex flex-col bg-white dark:bg-black lg:hidden">
          <div className="w-full min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pb-4 px-4 pt-4 mt-16">
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
                          className={`flex flex-col border-l-4 px-4 py-2 gap-1 ${
                            subItem.borderColor
                              ? (borderClassByColor[subItem.borderColor] ??
                                'border-transparent')
                              : 'border-transparent'
                          }`}
                          data-umami-event={`Header navigation: ${subItem.label}`}
                        >
                          <Text
                            preset="Body"
                            tag="h3"
                            className="font-semibold"
                          >
                            {subItem.label}
                          </Text>
                          <Text preset="Small" className="text-gray-dark">
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
        </div>
      )}
    </>
  );
}
