import { Metadata } from 'next';
import { ExternalLink } from '@/components/ExternalLink';
import { BulletedList, Text } from '@/components/ui/text-items';
import { Section } from '@/components/ui/section';
import { ArticlePage } from '@/components/ui/page';
import { FeedbackFormContent } from '@/components/FeedbackFormContent';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Feedback – Civic Dashboard' };

export default function ShareThoughtsPage() {
  return (
    <ArticlePage>
      <Text preset="Heading1">Share Your Thoughts</Text>
      <Section>
        <Text preset="Body">
          We’d love to hear any thoughts you're willing to share! We read every
          piece of feedback, and they are this project's guiding light.
        </Text>
        <Text preset="Body">
          In addition to general feedback, we also invite you to sign up for a
          user interview. These are done remotely with a member of of our team,
          and are typically 30-60 minutes.
        </Text>
        <Text preset="Body">
          All we ask is that you be respectful in your communication. It's 100%
          ok if you have strong negative feelings about any aspect of the
          project - we want to hear them! That said, everyone working on this
          project is a passion-driven volunteer who is truly doing their best.
          Please keep this in mind as you share your thoughts 😊
        </Text>
        <Card className="p-6 space-y-4">
          <Text preset="Heading3">Feedback Form</Text>
          <FeedbackFormContent />
        </Card>
      </Section>

      <Section>
        <Text preset="Heading2">Other Ways to Share</Text>
        <BulletedList>
          <li>
            <strong>Email</strong> - Send an email to{' '}
            <a
              href="mailto:teamcivicdashboard@gmail.com"
              className="classic-link"
            >
              teamcivicdashboard@gmail.com
            </a>
            .
          </li>
          <li>
            <strong>User Interview</strong> - sign up for a 30-60 minute remote
            conversation with a member of our team using the form above, or{' '}
            <a
              href="mailto:teamcivicdashboard@gmail.com
  ?subject=User%20Interview%20Signup
  &body=Hi%20there%21%0A%0A
  Thank%20you%20for%20signing%20up%20for%20a%20user%20interview%20-%20our%20team%20can%27t%20wait%20to%20meet%20you%20and%20hear%20what%20you%20have%20to%20say%21%20Interviews%20typically%20take%2030-60%20minutes%2C%20and%20are%20done%20virtually%20over%20Zoom%20or%20Google%20Meet.%0A%0A
  Please%20fill%20out%20the%20details%20below%20and%20someone%20from%20our%20team%20will%20be%20in%20touch%20shortly%20to%20schedule%20an%20interview.%20%0A%0A
  Name%3A%20%0A
  Availability%20in%20the%20next%202-3%20weeks%3A%0A%0A
  Anything%20else%20we%20should%20know%20before%20talking%20to%20you%3A%20%0A%0A
  Talk%20soon%21"
              className="classic-link"
            >
              this email template
            </a>
          </li>
          <li>
            <strong>Beta Users Group</strong> - join the{' '}
            <strong>#users-civic-dashboard</strong> channel in the{' '}
            <ExternalLink
              href="http://link.civictech.ca/slack"
              className="classic-link"
            >
              Civic Tech Toronto Slack
            </ExternalLink>{' '}
            to give quick feedback, ask questions, and participate in focus
            groups!
          </li>
          <li>
            <strong>Newsletter</strong> -{' '}
            <a
              href="https://civicdashboard.ca/join-newsletter"
              className="classic-link"
            >
              sign up for our newsletter
            </a>{' '}
            to know when we're asking for feedback!
          </li>
          <li>
            <strong>Meet Us</strong> - Come to{' '}
            <ExternalLink
              href="https://guild.host/ctto/events"
              className="classic-link"
            >
              Civic Tech Toronto breakout groups
            </ExternalLink>
            . These happen every Tuesday 7-9pm, both in-person somewhere in
            Toronto and over Zoom! They're full of friendly people working to
            make our city better and having fun doing it 😊.
          </li>
        </BulletedList>
      </Section>
    </ArticlePage>
  );
}
