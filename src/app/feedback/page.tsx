export default function ShareThoughtsPage() {
  return (
    <main className="min-h-screen bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900">
          Share Your Thoughts
        </h1>
        <p className="mt-4 text-xl text-gray-700">
          We’d love to hear any thoughts you&apos;re willing to share! Know that
          we read every piece of feedback, and that it is this project&apos;s
          guiding light.
        </p>
        <p className="mt-4 text-gray-700">
          All we ask is that you be respectful in your communication. It&apos;s
          100% ok if you have strong negative feelings about any aspect of the
          project - we want to hear them! That said, everyone working on this
          project is a passion-driven volunteer who is truly doing their best -
          please keep this in mind as you share your thoughts 😊
        </p>
      </section>

      {/* Ways to Share Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900">Ways to Share</h2>
        <ul className="mt-6 list-disc pl-6 space-y-4 text-gray-700">
          <li>
            <strong>Google Form</strong> - After checking out our products
            above, fill out this{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdTXLo01njU2E7ZJiLQHJJln3oEity1GMJnkuOIFS-63R0XiQ/viewform"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              form
            </a>
            .
          </li>
          <li>
            <strong>Email</strong> - Send an email to{' '}
            <a
              href="mailto:teamcivicdashboard@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              teamcivicdashboard@gmail.com
            </a>
            .
          </li>
          <li>
            <strong>User Interview</strong> -{' '}
            <a
              href="https://calendly.com/d/ckm5-wgb-xrh/30-minute-user-interview?month=2024-12"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Book a 30-minute remote conversation
            </a>{' '}
            with one of our designers.
          </li>
          <li>
            <strong>Meet Us</strong> - Come to a{' '}
            <a
              href="https://guild.host/ctto/events" // Replace with the actual Civic Tech Toronto events link
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
              rel="noopener noreferrer"
            >
              Civic Tech Toronto hacknight
            </a>
            . These happen every Tuesday 7-9pm, both in-person somewhere in
            Toronto and over Zoom! They&apos;re full of friendly people working
            to make our city better and having fun doing it 😊.
          </li>
        </ul>
      </section>
    </main>
  );
}
