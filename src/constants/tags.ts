/*
 * IMPORTANT NOTE:
 * Search subscriptions associated with tags have their queries in
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
  },
  bikes: {
    displayName: 'bikes',
  },
  homelessness: {
    displayName: 'homelessness',
  },
  dogs: {
    displayName: 'dogs',
  },
  parks: {
    displayName: 'parks',
  },
  construction: {
    displayName: 'construction',
  },
  traffic: {
    displayName: 'traffic',
  },
  transit: {
    displayName: 'transit',
  },
  noise: {
    displayName: 'noise',
  },
  energy: {
    displayName: 'energy',
  },
  climate: {
    displayName: 'climate',
  },
  infrastructure: {
    displayName: 'infrastructure',
  },
  safety: {
    displayName: 'safety',
  },
  arts: {
    displayName: 'arts',
  },
  childCare: {
    displayName: 'childcare',
  },
  democracy: {
    displayName: 'democracy',
  },
  costOfLiving: {
    displayName: 'cost of living',
  },
  healthcare: {
    displayName: 'healthcare',
  },
  equity: {
    displayName: 'equity',
  },
  business: {
    displayName: 'business',
  },
} as const satisfies Record<string, Tag>;

export const isTag = (str: string): str is TagEnum => str in allTags;

export type TagEnum = keyof typeof allTags;
export type Tag = {
  displayName: string;
};
