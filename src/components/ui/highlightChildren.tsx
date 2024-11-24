'use client';

import { useEffect, useRef } from 'react';
import Mark from 'mark.js';

type Props = React.PropsWithChildren<{
  element?: keyof JSX.IntrinsicElements;
  className?: string;
  terms: string | readonly string[];
}>;

export function HighlightChildren({
  children,
  terms,
  className,
  element = 'div',
}: Props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const instance = new Mark(containerRef.current);
    instance.unmark();
    instance.mark(terms);
  }, [terms]);

  // otherwise we get "expression produces a union type that is too complex to represent"
  const CastJustForTypescript = element as 'div';
  return (
    <CastJustForTypescript className={className} ref={containerRef}>
      {children}
    </CastJustForTypescript>
  );
}
