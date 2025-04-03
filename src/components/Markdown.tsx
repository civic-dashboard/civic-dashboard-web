// This file wraps react-markdown so we can ensure we configure it consistently
// When rendering markdown use this file instead of react-markdown directly
// eslint-disable-next-line no-restricted-imports
import RemarkMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
}

export const Markdown = (props: MarkdownProps) => (
  <div className="rich-html-styles">
    <RemarkMarkdown {...props} />
  </div>
);
