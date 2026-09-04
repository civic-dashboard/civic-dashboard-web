import { Metadata } from 'next';
import { Text } from '@/components/ui/text-items';
import { Section } from '@/components/ui/section';
import { ArticlePage } from '@/components/ui/page';
import { FeedbackFormContent } from '@/components/FeedbackFormContent';

export const metadata: Metadata = { title: 'Feedback – Civic Dashboard' };

export default function ShareThoughtsPage() {
  return (
    <ArticlePage>
      <Text preset="Heading1">Share Your Thoughts</Text>
      <Section>
        <Text preset="Body">
          We’d love to hear any thoughts you're willing to share! Know that we
          read every piece of feedback, and that it is this project's guiding
          light.
        </Text>
        <Text preset="Body">
          All we ask is that you be respectful in your communication - everyone
          working on this project is a passion-driven volunteer doing their
          best.
        </Text>
      </Section>
      <FeedbackFormContent />
    </ArticlePage>
  );
}
