export const menuItems = [
  { label: 'Home', href: '/' },
  {
    label: 'How Council Works',
    href: '/how-council-works',
  },
  { label: 'Actions', href: '/actions' },
  {
    label: 'Councillors',
    href: '/councillors',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'Feedback',
    href: '/feedback',
  },
  {
    label: 'Wiki',
    href: '/wiki',
  },
];

type FooterNavItem = {
  label: string;
  href: string;
  umamiEvent?: string;
};

type FooterIconItem = {
  icon: string;
  href: string;
  alt: string;
  umamiEvent: string;
};

// Constants for the footer
export const civicDashboardItems: FooterNavItem[] = [
  {
    label: 'Council Activity',
    href: '/actions',
    umamiEvent: 'Council Activity',
  },
  {
    label: 'Councillor Watch',
    href: '/councillors',
    umamiEvent: 'Councillor Watch',
  },
  {
    label: 'How Council Works',
    href: '/how-council-works',
    umamiEvent: 'How Council Works',
  },
  {
    label: 'The Wiki',
    href: '/wiki',
    umamiEvent: 'The Wiki',
  },
];

export const resourceItems: FooterNavItem[] = [
  {
    label: 'Source code',
    href: 'https://github.com/civic-dashboard',
    umamiEvent: 'GitHub',
  },
  {
    label: 'Slack',
    href: 'https://civictechto.slack.com/archives/C06KU3DHEKV',
    umamiEvent: 'Slack',
  },
  {
    label: 'Documentation',
    href: '',
  },
  {
    label: 'Civic Tech Toronto',
    href: 'https://civictech.ca/',
    umamiEvent: 'Civic Tech Toronto',
  },
];

export const companyItems: FooterNavItem[] = [
  {
    label: 'About us',
    href: '/about',
    umamiEvent: 'About us',
  },
  {
    label: 'Contact',
    href: 'mailto:teamcivicdashboard@gmail.com',
    umamiEvent: 'Contact',
  },
  { label: 'Join us', href: '/join', umamiEvent: "Join us" },
  {
    label: 'Sign up for our newsletter',
    href: '/join-newsletter',
    umamiEvent: 'Newsletter Signup',
  },
];

export const iconItems: FooterIconItem[] = [
  {
    icon: '/bluesky.svg',
    href: 'https://bsky.app/profile/civicdashboard.bsky.social',
    alt: 'Bluesky',
    umamiEvent: 'Bluesky',
  },
  {
    icon: '/linkedin.svg',
    href: 'https://www.linkedin.com/company/civic-dashboard/about/',
    alt: 'LinkedIn',
    umamiEvent: 'LinkedIn',
  },
  {
    icon: '/github.svg',
    href: 'https://github.com/civic-dashboard',
    alt: 'GitHub',
    umamiEvent: 'GitHub',
  },
  {
    icon: '/slack.svg',
    href: 'https://civictechto.slack.com/archives/C06KU3DHEKV',
    alt: 'Slack',
    umamiEvent: 'Slack',
  },
];
