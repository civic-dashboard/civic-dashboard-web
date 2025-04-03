import { ExternalLink } from '@/components/ExternalLink';

export default function ShareThoughtsPage() {
  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-lg">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold">Share Your Thoughts</h1>
        <p className="mt-4">
          We’d love to hear any thoughts you&apos;re willing to share! Know that
          we read every piece of feedback, and that it is this project&apos;s
          guiding light.
        </p>
        <p className="mt-4">
          All we ask is that you be respectful in your communication. It&apos;s
          100% ok if you have strong negative feelings about any aspect of the
          project - we want to hear them! That said, everyone working on this
          project is a passion-driven volunteer who is truly doing their best -
          please keep this in mind as you share your thoughts 😊
        </p>
      </section>

      {/* Ways to Share Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold">Ways to Share</h2>
        <ul className="mt-6 list-disc pl-6 space-y-4">
          <li>
            <strong>Google Form</strong> - After checking out our products
            above, fill out this{' '}
            <ExternalLink
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTXLo01njU2E7ZJiLQHJJln3oEity1GMJnkuOIFS-63R0XiQ/viewform"
              className="classic-link"
            >
              form
            </ExternalLink>
            .
          </li>
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
            conversation with a member of our team{' '}
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
              using this email template
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
            to know when we&apos;re asking for feedback!
          </li>
          <li>
            <strong>Meet Us</strong> - Come to a{' '}
            <ExternalLink
              href="https://guild.host/ctto/events"
              className="classic-link"
            >
              Civic Tech Toronto hacknight
            </ExternalLink>
            . These happen every Tuesday 7-9pm, both in-person somewhere in
            Toronto and over Zoom! They&apos;re full of friendly people working
            to make our city better and having fun doing it 😊.
          </li>
        </ul>
      </section>
    </main>
  );
}
