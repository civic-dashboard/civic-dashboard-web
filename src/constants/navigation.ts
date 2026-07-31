export const newMenuItems = [
  {
    label: 'Our tools',
    slug: 'our-tools',
    subItems: [
      {
        label: 'Council Activity',
        description:
          'Track current issues & meetings and register to attend or speak.',
        href: '/actions',
        borderColor: 'success',
      },
      {
        label: 'Councillor Watch',
        description: 'Find your councillor and see their voting history.',
        href: '/councillors',
        borderColor: 'danger',
      },
      {
        label: 'How Council Works',
        description:
          'Understand City Council processes and how you can participate.',
        href: '/how-council-works',
        borderColor: 'warning',
      },
      {
        label: 'Civic Dashboard Wiki',
        description: 'Detailed guides, explanations and resources.',
        href: '/wiki',
        borderColor: 'primary',
      },
      {
        label: "Don't see what you're looking for?",
        description:
          "We're always looking to improve! Suggest a feature or improvement to help you better engage with City Council.",
        href: '/feedback',
      },
    ],
  },
  {
    label: 'About this project',
    slug: 'about-this-project',
    subItems: [
      {
        label: 'About us',
        description: 'Learn about the team behind Civic Dashboard.',
        href: '/about',
      },
      {
        label: 'Get involved',
        description: 'Join our volunteer-run team through weekly hack nights.',
        href: '/join',
      },
      {
        label: 'Civic Dashboard Lab',
        description: "Browse potential ideas we're experimenting with.",
        href: '/labs',
      },
      {
        label: 'Browse our code',
        description: 'Civic Dashboard is free and open-source software',
        href: 'https://github.com/civic-dashboard/civic-dashboard-web',
      },
      {
        label: 'Give us feedback',
        description:
          "We're always looking to improve! Suggest a feature or improvement to help you better engage with City Council.",
        href: '/feedback',
      },
    ],
  },
];
