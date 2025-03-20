import { Body, Head, Html, Preview } from '@react-email/components';

type Props = React.PropsWithChildren<{
  previewText: string;
}>;
export const EmailWrapper = ({ previewText, children }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>{children}</Body>
    </Html>
  );
};

const main = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '12px',
};
