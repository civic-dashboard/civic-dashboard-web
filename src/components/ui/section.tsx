import React from 'react';

/**
 * Default wrapper for section contents.
 * Renders a `<section>` element with preset margins and space between
 * child items. This means you DO NOT need to set top/bottom margin/padding
 * on the paragraphs/etc that are immediate children of this component!
 */
export function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-16 space-y-4">{children}</section>;
}
