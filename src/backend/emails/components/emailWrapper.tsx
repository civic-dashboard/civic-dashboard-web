import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
} from '@react-email/components';
import { UnsubscribeLink } from '@/backend/emails/components/unsubscribeLink';

type Props = React.PropsWithChildren<{
  previewText: string;
  unsubscribeToken: string;
}>;
export const EmailWrapper = ({
  previewText,
  unsubscribeToken,
  children,
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container>
          {children}
          <Hr />
          <UnsubscribeLink unsubscribeToken={unsubscribeToken}>
            Unsubscribe
          </UnsubscribeLink>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: '12px',
};
