import { Metadata } from 'next';
import { ExternalLink } from '@/components/ExternalLink';

export const metadata: Metadata = {
  title: 'About Us – Civic Dashboard',
};

export default function About() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">About Us</h1>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Why We Exist</h2>
            <p className="mb-6">
              In brief, we're regular Torontonians who believe:
            </p>
            <ul className="space-y-4 mb-8">
              <li>
                Finding out what is happening that is relevant to you in your
                local (municipal/provincial) government and what you can do
                about it should be universally accessible.
              </li>
              <li>
                A democracy is only democratic if it's accessible, and ours
                currently isn't for the vast majority of its residents.
              </li>
              <li>
                A more engaged democracy is a more representative and effective
                one.
              </li>
              <li>
                Democratic engagement should be a clear, actionable, meaningful,
                and satisfying response to wanting to see a change in the place
                you live. It should be at least as good an option as stewing in
                frustration, or ranting to a friend, or tweeting, or just plain
                old apathy.
              </li>
            </ul>
            <div className="space-y-6">
              <p>
                We think that people care a lot, they just aren't given the
                right tools to translate that passion into democratic
                engagement. We believe a more accessible, lower-friction
                democracy will be adopted more widely, will be more
                representative of our city's population and its desires, will be
                engaged with far more often than just during elections, and will
                contribute to a more bought-in, people-centric, and flourishing
                city - and that that's worth working on.
              </p>
              <p>
                Lastly, we believe that a small group of humble, ambitious,
                curious, hopeful, collaborative, and coordinated volunteers can
                make meaningful strides towards a more democratic Toronto.
              </p>
              <p>
                Learn more about our{' '}
                <ExternalLink
                  href="https://docs.google.com/document/d/1J-gB3mbbXEZJfA1QzSN-H-8ZZKGFwwW-ISAROL3PeQA/edit?tab=t.0"
                  className="classic-link"
                >
                  Theory of Change
                </ExternalLink>{' '}
                here.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">
              About Our Organization
            </h2>
            <p className="mb-6">
              Here are the core things to know about our team!
            </p>
            <ul className="space-y-4 mb-8">
              <li>
                We're not for profit - no one is making money off of this, and
                no one ever will. This is made by people who care and come
                together, so that people can more easily care and come together,
                for the benefit of all.
              </li>
              <li>
                We keep costs low, we use volunteer labour, and we are
                thoughtful and self-critical about the pressures and incentives
                we exist under. We're building this as long-term critical public
                infrastructure - thoughtfully, prioritizing public input and
                stability, and without profit in mind.
              </li>
              <li>
                We're 100% volunteer driven - and we welcome all contributions!
                Democracy's not gonna upgrade itself.
              </li>
            </ul>
            <div className="space-y-6">
              <p>
                Learn more about the team and how you can contribute/join{' '}
                <a href="/join" className="classic-link">
                  here
                </a>
                .
              </p>
              <p>
                We're an open organization - that means we default to showing
                everyone everything, including our works in progress! As a
                start, you can find:
              </p>
              <ul className="space-y-4 mb-8">
                <li>
                  <ExternalLink
                    href="https://docs.google.com/document/d/1o00Ce6k4YUFsKFju1BUJodRgOjXyaImXMHkdemTkSRA/edit?tab=t.0"
                    className="classic-link"
                  >
                    Our organization's core documents and directory
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://github.com/civic-dashboard/civic-dashboard"
                    className="classic-link"
                  >
                    Our code and associated documentation
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="http://link.civictech.ca/slack"
                    className="classic-link"
                  >
                    Our communications and action items (in the{' '}
                    #proj-civic-dashboard channel)
                  </ExternalLink>
                </li>
              </ul>
              <p>
                If there's something you want to know about our organization or
                work but can't see below, it's due to one of:
              </p>
              <ul className="space-y-4 mb-8">
                <li>The ever-present gap between documentation and reality</li>
                <li>The privacy of our contributors and/or users</li>
                <li>
                  An oversight on the part of our incredible, but human and
                  therefore fallible, team
                </li>
              </ul>
              <p>
                If you have questions, concerns, curiosities, or comments, shoot
                us an email at{' '}
                <a
                  href="mailto:teamcivicdashboard@gmail.com"
                  className="classic-link"
                >
                  teamcivicdashboard@gmail.com
                </a>
                , join our{' '}
                <a href="/join-newsletter" className="classic-link">
                  newsletter,
                </a>{' '}
                follow us on{' '}
                <ExternalLink
                  href="https://bsky.app/profile/civicdashboard.bsky.social"
                  className="classic-link"
                >
                  BlueSky
                </ExternalLink>{' '}
                or find us in the{' '}
                <ExternalLink
                  href="http://link.civictech.ca/slack"
                  className="classic-link"
                >
                  #proj-civic-dashboard
                </ExternalLink>{' '}
                channel in the Civic Tech Toronto Slack!
              </p>
              <p>
                We are a project of{' '}
                <ExternalLink
                  href="https://civictech.ca"
                  className="classic-link"
                >
                  Civic Tech Toronto
                </ExternalLink>{' '}
                - a completely volunteer-run weekly civic tech lecture and work
                session series that hasn't missed a Tuesday in almost a decade!
                If you're interested in learning more about projects like this
                one, the civic technology space, and meeting folks passionate
                about it in Toronto, come to one of the{' '}
                <ExternalLink
                  href="https://guild.host/ctto/events"
                  className="classic-link"
                >
                  weekly hacknights
                </ExternalLink>{' '}
                - they happen every Tuesday 7-9pm somewhere in Toronto and on
                Zoom.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
