import { Heading1, Heading2, BulletedList } from '@/components/ui/text-items';
import { Section } from '@/components/ui/section';
import { Page } from '@/components/ui/page';

export default function JoinPage() {
  return (
    <Page>
      {/* Hero Section */}
      <Section>
        <Heading1>Join The Team!</Heading1>
        <p>
          We're a completely volunteer-run team - meaning that all of us were
          once where you are, just hearing about this project for the first
          time! No matter who you are, you can contribute to this project.
        </p>
      </Section>

      {/* Who We Need Section */}
      <Section>
        <p>
          If you have technical skills in software development, user experience
          design/research, product/project management, research/writing,
          marketing/communication, or anything else relevant to a non-profit,
          open source technology project? We need you.
        </p>

        <p>
          If you have experience/expertise in government, policy, organizing,
          activism, campaigning, or anything related to political engagement? We
          need you.
        </p>

        <p>
          If you're just someone who believes that we can more peacefully,
          thoughtfully, creatively, and sustainably coexist, believes this
          project could be a way to help do that, and wants to contribute? We
          need you.
        </p>
      </Section>

      {/* How We Work Section */}
      <Section>
        <Heading2>How We Work</Heading2>
        <p>
          We collaborate by breaking up our work into manageable pieces, then
          getting it done based on these principles:
        </p>

        <BulletedList>
          <li>
            <strong>Autonomy</strong> - you choose what you work on! Put your
            name down for tasks, and feel free to add tasks if you want to work
            on something that isn't currently there. We trust your intelligence!
          </li>
          <li>
            <strong>Ownership</strong> - our only rule is that if you recognize
            you can't do something you have your name on, that's perfectly ok!
            Just let us know and we'll either get you help or find someone who
            can.
          </li>
          <li>
            <strong>Longevity</strong> - do work such that others can pick up
            where you left off! Make it so you can put down the shovel guilt
            free, and the next person can pick it up.
          </li>
        </BulletedList>

        <p>
          We rarely set deadlines, we get the majority of our work done on our
          own time, and we communicate asynchronously via{' '}
          <a
            href="http://link.civictech.ca/slack"
            target="_blank"
            className="classic-link"
            rel="noopener noreferrer"
          >
            Slack
          </a>{' '}
          and sync up at weekly{' '}
          <a
            href="https://civictech.ca"
            target="_blank"
            className="classic-link"
            rel="noopener noreferrer"
          >
            Civic Tech Toronto
          </a>{' '}
          meetups.
        </p>

        <p>
          We've had folks contribute continuously from the start of the project,
          we've had folks come in and out, we've had folks contribute intensely
          for a short stretch, and we're accommodating of and deeply grateful
          for it all.
        </p>
      </Section>

      {/* Ways to Get Involved Section */}
      <Section>
        <Heading2>Ways to Get Involved</Heading2>
        <BulletedList>
          <li>
            <strong>Onboarding</strong> - Read through our{' '}
            <a
              href="https://docs.google.com/document/d/1o00Ce6k4YUFsKFju1BUJodRgOjXyaImXMHkdemTkSRA/edit"
              target="_blank"
              className="classic-link"
              rel="noopener noreferrer"
            >
              Onboarding document
            </a>{' '}
            to get a sense of what we're building, where we're aiming, and how
            we're collaborating to get there.
          </li>
          <li>
            <strong>Email</strong> - Shoot an email to{' '}
            <a
              href="mailto:teamcivicdashboard@gmail.com"
              className="classic-link"
            >
              teamcivicdashboard@gmail.com
            </a>{' '}
            introducing yourself!
          </li>
          <li>
            <strong>Newsletter</strong> -{' '}
            <a href="/join-newsletter" className="classic-link">
              Join our newsletter
            </a>{' '}
            to learn what we are up to and what we might need help with
          </li>
          <li>
            <strong>Slack</strong> - Join us on the{' '}
            <a
              href="http://link.civictech.ca/slack"
              target="_blank"
              className="classic-link"
              rel="noopener noreferrer"
            >
              Civic Tech Toronto Slack
            </a>{' '}
            in #proj-civic-dashboard, check out our Action Items and introduce
            yourself there!
          </li>
          <li>
            <strong>Come To A Work Session</strong> - We meet every Tuesday
            7-9pm at{' '}
            <a
              href="https://guild.host/ctto/events"
              target="_blank"
              className="classic-link"
              rel="noopener noreferrer"
            >
              Civic Tech Toronto hacknights
            </a>
            , which happen both in-person somewhere in Toronto and over Zoom!
          </li>
        </BulletedList>
      </Section>
    </Page>
  );
}
