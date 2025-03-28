import DOMPurify, {
  type Config as DOMPurifyConfig,
} from 'isomorphic-dompurify';

const config: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'strong',
    'ul',
    'ol',
    'li',
    'span',
    'em',
    'sup',
    // 'a', // Todo: tricky since we ought to add rel, target, and class
  ],
  ALLOWED_ATTR: ['title'],
};

export const sanitize = (text: string) => {
  if (!text) return '';
  const safeSummary = DOMPurify.sanitize(text, config);
  if (!safeSummary) throw new Error(`No content after sanitizing`);
  return safeSummary;
};
