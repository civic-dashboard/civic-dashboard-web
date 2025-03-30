export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Privacy Policy</h1>

          <p>
            We strive to keep this page up to date with a simple explanation of
            what data about you we store or send to 3rd parties as part of
            operating Civic Dashboard! This project is nascent, and we&apos;re
            aware we need to flesh this out more.{' '}
            <a href="/feedback">Let us know how we can do better! </a>
          </p>

          <p>
            Currently, all we store is information users have submitted to us to
            subscribe to searches. That means an email address and associated
            search filters.
          </p>

          <p>
            Additionally, the 3rd party providers we use to host the website and
            send emails have their own privacy policies. These providers are:
          </p>
          <ul>
            <li>
              <a href="https://www.cloudflare.com/en-ca/privacypolicy" target="_blank">
                Cloudflare
              </a>
            </li>
            <li>
              Sevalla, a service provided by{' '}
              <a href="https://kinsta.com/legal/privacy-policy/" target="_blank">Kinsta</a>
            </li>
            <li>
              <a href="https://resend.com/legal/privacy-policy" target="_blank">Resend</a>
            </li>
            <li>
              <a href="https://steadyhq.com/en/privacy" target="_blank">Steady</a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
