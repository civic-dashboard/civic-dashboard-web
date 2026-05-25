import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import type { FeedbackPayload } from '@/types/feedback';

export function FeedbackEmailTemplate({
  payload,
}: {
  payload: FeedbackPayload;
}) {
  if (payload.type === 'text') {
    return (
      <Html>
        <Head />
        <Preview>New feedback on Civic Dashboard</Preview>
        <Body
          style={{ fontFamily: 'Arial, Helvetica, sans-serif', margin: '12px' }}
        >
          <Container>
            {payload.name.trim() && <Text>From: {payload.name}</Text>}
            <Text>{payload.message}</Text>
          </Container>
        </Body>
      </Html>
    );
  }
  return (
    <Html>
      <Head />
      <Preview>User interview signup on Civic Dashboard</Preview>
      <Body
        style={{ fontFamily: 'Arial, Helvetica, sans-serif', margin: '12px' }}
      >
        <Container>
          <Text>Name: {payload.name}</Text>
          <Text>Email: {payload.email}</Text>
          <Text>Availability: {payload.availability}</Text>
        </Container>
      </Body>
    </Html>
  );
}
