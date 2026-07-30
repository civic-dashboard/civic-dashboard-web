'use client';
import { useState } from 'react';
import { newMenuItems } from '@/constants/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import NotificationBanner from '@/components/navigation/NotificationBanner';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text-items';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const gradientAnimation = `
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const borderClassByColor: Record<string, string> = {
  success: 'border-success',
  warning: 'border-warning',
  danger: 'border-danger',
  primary: 'border-primary',
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <NotificationBanner
        message="We love and need your feedback! Tap to share your thoughts."
        link="/feedback"
      />
      <header className="sticky top-0 z-10 bg-white dark:bg-black">
        <style jsx global>
          {gradientAnimation}
        </style>
        <nav className="max-w-7xl py-2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Civic Dashboard Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </Link>
              <Text
                preset="Heading3"
                tag="span"
                className="text-xl text-black dark:text-white"
              >
                <Link href="/">Civic Dashboard</Link>
              </Text>
            </div>

            {/* Desktop Navigation */}
            {/* <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div> */}

            {/* Mobile/Tablet menu button */}
            <div className="lg:hidden flex items-center py-2">
              <Button
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                variant="outline"
                size="icon"
                className='text-black border-black'
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile/Tablet Menu - moved outside header */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[9] flex flex-col bg-white dark:bg-black lg:hidden">
          <div className="w-full min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pb-4 px-4 pt-4 mt-16">
            <Accordion
              type="single"
              collapsible
              defaultValue={newMenuItems[0].label}
              className="w-full flex flex-col gap-4"
            >
              {newMenuItems.map((item) => (
                <AccordionItem key={item.label} value={item.label} className="border-gray-light dark:border-white/10">
                  <AccordionTrigger
                    variant="heading"
                    className="data-[state=open]:bg-primary-lightest data-[state=open]:dark:bg-primary py-4"
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
