// This file is the ONLY one allowed to use react-intersection-observer
// eslint-disable-next-line no-restricted-imports
import { useInView, IntersectionOptions } from 'react-intersection-observer';

const defaultOptions: IntersectionOptions = {
  threshold: 0.1,
};

export function useIntersectionObserver(options?: IntersectionOptions) {
  const mergedOptions = { ...defaultOptions, ...options };

  const result = useInView(mergedOptions);

  return result;
}
