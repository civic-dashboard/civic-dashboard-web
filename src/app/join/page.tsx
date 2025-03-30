export default function JoinPage() {
  return (
    <main className="min-h-screen bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900">Join The Team!</h1>
        <p className="mt-4 text-xl text-gray-700">
          We&apos;re a completely volunteer-run team - meaning that all of us
          were once where you are, just hearing about this project for the first
          time! No matter who you are, you can contribute to this project.
        </p>
      </section>

      {/* Who We Need Section */}
      <section className="mb-16">
        <div className="space-y-4 text-gray-700">
          <p>
            If you have technical skills in software development, user
            experience design/research, product/project management,
            research/writing, marketing/communication, or anything else relevant
            to a non-profit, open source technology project? We need you.
          </p>

          <p>
            If you have experience/expertise in government, policy, organizing,
            activism, campaigning, or anything related to political engagement?
            We need you.
          </p>

          <p>
            If you&apos;re just someone who believes that we can more
            peacefully, thoughtfully, creatively, and sustainably coexist,
            believes this project could be a way to help do that, and wants to
            contribute? We need you.
          </p>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900">How We Work</h2>
        <p className="mt-4 text-gray-700">
          We collaborate by breaking up our work into manageable pieces, then
          getting it done based on these principles:
        </p>

        <ul className="mt-6 list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Autonomy</strong> - you choose what you work on! Put your
            name down for tasks, and feel free to add tasks if you want to work
            on something that isn&apos;t currently there. We trust your
            intelligence!
          </li>
          <li>
            <strong>Ownership</strong> - our only rule is that if you recognize
            you can&apos;t do something you have your name on, that&apos;s
            perfectly ok! Just let us know and we&apos;ll either get you help or
            find someone who can.
          </li>
          <li>
            <strong>Longevity</strong> - do work such that others can pick up
            where you left off! Make it so you can put down the shovel guilt
            free, and the next person can pick it up.
          </li>
        </ul>

        <div className="mt-8 space-y-4">
          <p className="text-gray-700">
            We rarely set deadlines, we get the majority of our work done on our
            own time, and we communicate asynchronously via{' '}
            <a
              href="http://link.civictech.ca/slack"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Slack
            </a>{' '}
            and sync up at weekly{' '}
            <a
              href="https://civictech.ca"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Civic Tech Toronto
            </a>{' '}
            meetups.
          </p>

          <p className="text-gray-700">
            We&apos;ve had folks contribute continuously from the start of the
            project, we&apos;ve had folks come in and out, we&apos;ve had folks
            contribute intensely for a short stretch, and we&apos;re
            accommodating of and deeply grateful for it all.
          </p>
        </div>
      </section>

      {/* Ways to Get Involved Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900">
          Ways to Get Involved
        </h2>
        <ul className="mt-6 list-disc pl-6 space-y-4 text-gray-700">
          <li>
            <strong>Onboarding</strong> - Read through our{' '}
            <a
              href="https://docs.google.com/document/d/1o00Ce6k4YUFsKFju1BUJodRgOjXyaImXMHkdemTkSRA/edit"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Onboarding document
            </a>{' '}
            to get a sense of what we&apos;re building, where we&apos;re aiming,
            and how we&apos;re collaborating to get there.
          </li>
          <li>
            <strong>Email</strong> - Shoot an email to{' '}
            <a
              href="mailto:teamcivicdashboard@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              teamcivicdashboard@gmail.com
            </a>{' '}
            introducing yourself!
          </li>
          <li>
            <strong>Newsletter</strong> -{' '}
            <a href="/join-newsletter" className="text-blue-600 hover:text-blue-800 underline">Join our newsletter</a> to learn what we
            are up to and what we might need help with
          </li>
          <li>
            <strong>Slack</strong> - Join us on the{' '}
            <a
              href="http://link.civictech.ca/slack"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
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
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Civic Tech Toronto hacknights
            </a>
            , which happen both in-person somewhere in Toronto and over Zoom!
          </li>
        </ul>
      </section>
    </main>
  );
}
