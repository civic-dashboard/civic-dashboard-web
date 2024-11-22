import { useEffect, useRef } from 'react';
import Mark from 'mark.js';

type Props = React.PropsWithChildren<{
  terms: string | readonly string[];
}>;

export function HighlightChildren({ children, terms }: Props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const instance = new Mark(containerRef.current);
    instance.unmark(); // Clear previous highlights
    instance.mark(terms, {}); // Apply new highlights
  }, [terms]);

  return <div ref={containerRef}>{children}</div>;
}
