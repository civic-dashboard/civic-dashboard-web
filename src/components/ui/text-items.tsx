import React from 'react';

/**
 * Renders a `<h1>` with correct styling.
 */
export function Heading1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl font-bold mb-12">{children}</h1>;
}

/**
 * Renders a `<h2>` with correct styling.
 */
export function Heading2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-semibold mb-6">{children}</h2>;
}

/**
 * Renders a `<h3>` with correct styling.
 */
export function Heading3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-bold mb-6">{children}</h3>;
}

/**
 * Renders a `<ul>` styled as a bulleted list. `children` should be `<li>`
 * elements. You do not need to add margin/padding for `<li>` -- this component
 * will provide it automatically.
 */
export function BulletedList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc mb-6 pl-6 space-y-4">{children}</ul>;
}
