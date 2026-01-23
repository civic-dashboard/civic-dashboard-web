import React from 'react';

/**
 * Default wrapper for page contents.
 * Renders a `<main>` element with preset padding and max-width, and ensures the
 * content is centered within wide viewports.
 */
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">{children}</main>
  );
}

/**
 * Default wrapper for page contents, where the content is mainly text. This uses
 * a smaller max-width than `Page`, for improved readability.
 *
 * Renders a `<main>` element with preset padding and max-width, and ensures the
 * content is centered within wide viewports.
 */
export function ArticlePage({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">{children}</main>
  );
}
