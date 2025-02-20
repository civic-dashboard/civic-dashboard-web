// To ensure consistent behaviour this file is the ONLY one allowed to use slugify
// eslint-disable-next-line no-restricted-imports
import slugify from 'slugify';

const slugifyOptions = { lower: true };

export const toSlug = (input: string): string => {
  if (input === '') throw new Error(`Cannot slugify empty string`);
  if (input.trim() === '') throw new Error(`Cannot slugify pure whitespace`);
  const output = slugify(input, slugifyOptions);
  if (output === '')
    throw new Error(`Slugifying "${input}" produced empty string`);
  return output;
};
