/*
 * IMPORTANT NOTE:
 * The search query associated with each tag is baked into the
 * database row for each search subscription so that we can query
 * against those rows without having to bring data back into the
 * application layer. There is a pipeline in GitHub which runs
 * on every merge to main to keep prod in sync, so hopefully this
 * doesn't require manual intervention but it's good to be aware
 * of when modifying these definitions.
 */

export const allTags = {
  housing: {
    displayName: 'housing',
    searchQuery:
      'housing OR renoviction OR rent control OR "public housing" OR "vacant homes tax" OR "property tax"',
  },
  bikes: {
    displayName: 'bikes',
    searchQuery: 'bikes OR bicycle',
  },
  homelessness: {
    displayName: 'homelessness',
    searchQuery: 'homeless OR houseless OR unsheltered',
  },
  dogs: {
    displayName: 'dogs',
    searchQuery: 'dog',
  },
  parks: {
    displayName: 'parks',
    searchQuery: 'park',
  },
  construction: {
    displayName: 'construction',
    searchQuery: 'construction',
  },
  traffic: {
    displayName: 'traffic',
    searchQuery: 'traffic',
  },
  transit: {
    displayName: 'transit',
    searchQuery: 'transit',
  },
  noise: {
    displayName: 'noise',
    searchQuery: 'noise',
  },
  energy: {
    displayName: 'energy',
    searchQuery: 'energy',
  },
  climate: {
    displayName: 'climate',
    searchQuery: 'climate',
  },
  infrastructure: {
    displayName: 'infrastructure',
    searchQuery:
      'infrastructure OR "storm drains" OR bathrooms OR internet OR broadband',
  },
  safety: {
    displayName: 'safety',
    searchQuery: 'safety OR police OR "crisis response" OR "public safety"',
  },
  arts: {
    displayName: 'arts',
    searchQuery: 'arts OR culture',
  },
  childCare: {
    displayName: 'child care',
    searchQuery: '"child care" OR childcare',
  },
  democracy: {
    displayName: 'democracy',
    searchQuery:
      'democracy OR "ranked choice" OR "democratic engagement" OR "democratic accessibility"',
  },
  costOfLiving: {
    displayName: 'cost of living',
    searchQuery: '"cost of living"',
  },
  healthcare: {
    displayName: 'healthcare',
    searchQuery: 'healthcare OR "mental health"',
  },
  equity: {
    displayName: 'equity',
    searchQuery: 'equity',
  },
  business: {
    displayName: 'business',
    searchQuery: 'business',
  },
} as const satisfies Record<string, Tag>;

export const isTag = (str: string): str is TagEnum => str in allTags;

export type TagEnum = keyof typeof allTags;
export type Tag = {
  displayName: string;
  searchQuery: string;
};
