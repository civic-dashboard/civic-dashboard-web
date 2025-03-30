import RemarkMarkdown from 'react-markdown';

// Todo: Block in ESLint
interface MarkdownProps {
  children: string;
}

export const Markdown = (props: MarkdownProps) => <RemarkMarkdown {...props} />;
