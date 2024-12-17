'use client';

import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';

export const AppNavigation = () => {
  return (
    <header className="flex items-center flex-wrap justify-center bg-white py-1 px-2 gap-2 sticky top-0  border-b-2 border-slate-200">
      <div className="relative mr-8">
        <Link href="/">
          <h1 className="text-2xl mb-0 font-semibold">Civic Dashboard</h1>
        </Link>
        <span className="absolute -top-2 -right-8 rotate-[30deg] text-sky-700 font-bold font-sans">
          beta!
        </span>
      </div>
      <NavigationContent />
    </header>
  );
};

function NavigationContent() {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        <NavMenuLink text="Upcoming Agenda Items" href="/" />
        <NavMenuLink text="Public Consultations" href="/public-consultations" />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type Props = {
  text: string;
  href: string;
};
function NavMenuLink({ text, href }: Props) {
  const pathname = usePathname();

  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={navigationMenuTriggerStyle()}
          active={pathname === href}
        >
          {text}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
