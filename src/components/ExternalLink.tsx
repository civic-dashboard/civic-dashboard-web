import React from 'react';

type AnchorProps = JSX.IntrinsicElements['a'];
export type ExternalLinkProps = Omit<
  AnchorProps,
  'target' | 'rel' | 'children'
> & {
  children?: React.ReactNode;
};

export const ExternalLink: React.FC<ExternalLinkProps> = (props) => (
  <a {...props} target="_blank" rel="noopener noreferrer" />
);
