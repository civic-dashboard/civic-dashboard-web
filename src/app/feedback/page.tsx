import { Metadata } from 'next';
import { Heading1 } from '@/components/ui/text-items';
import { Section } from '@/components/ui/section';
import { ArticlePage } from '@/components/ui/page';
import { FeedbackFormContent } from '@/components/FeedbackFormContent';

export const metadata: Metadata = {
  title: 'Feedback – Civic Dashboard',
};

export default function ShareThoughtsPage() {
  return (
    <ArticlePage>
      <Heading1>Share Your Thoughts</Heading1>
      <Section>
        <p>
          We&apos;d love to hear any thoughts you&apos;re willing to share! We
          read every piece of feedback, and it is this project&apos;s guiding
          light.
        </p>
        <p>
          All we ask is that you be respectful in your communication — everyone
          working on this project is a passion-driven volunteer doing their
          best.
        </p>
      </Section>
      <FeedbackFormContent />
    </ArticlePage>
  );
}
