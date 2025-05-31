import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – Civic Dashboard',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h1>Privacy Policy</h1>

          <p>
            We strive to keep this page up to date with a simple explanation of
            what data about you we store or send to 3rd parties as part of
            operating Civic Dashboard! This project is nascent, and we're aware
            we need to flesh this out more.{' '}
            <a href="/feedback">Let us know how we can do better! </a>
          </p>

          <h2>Data You Submit To Us For Our Features To Work</h2>
          <p>
            If you subscribe to a search on the actions page, we will store your
            email address along with the associated search filters.
          </p>

          <h2>Data We Collect To Help Us Improve Civic Dashboard</h2>
          <p>
            We store analytics data alongside an anonimyzed time-bound
            identifier with{' '}
            <a href="https://umami.is/" target="_blank">
              Umami
            </a>
            . We make this data{' '}
            <a
              href="https://eu.umami.is/share/6R9CNotgCUNEmDL5/civicdashboard.ca"
              target="_blank"
            >
              public
            </a>{' '}
            for transparency and accountability, and so that the value of this
            data, which was created by the public, can be used by the public as
            well.
          </p>

          <p>
            That means the pages you view and significant actions you take on
            the website (but NOT any content you submit to the website) will be
            stored alongside an identifier that can't be linked back to you, and
            which is changed every month.
          </p>

          <p>
            For example, we may store that you viewed our home page, then
            actions page, then filtered by certain tags, then submitted a
            comment to council, but NOT what that comment was.
          </p>

          <h2>Full List of 3rd Party Providers</h2>
          <p>
            Additionally, the 3rd party providers we use to host the website and
            send emails have their own privacy policies. These providers are:
          </p>
          <ul>
            <li>
              <a
                href="https://www.cloudflare.com/en-ca/privacypolicy"
                target="_blank"
              >
                Cloudflare
              </a>
            </li>
            <li>
              Sevalla, a service provided by{' '}
              <a
                href="https://kinsta.com/legal/privacy-policy/"
                target="_blank"
              >
                Kinsta
              </a>
            </li>
            <li>
              <a href="https://resend.com/legal/privacy-policy" target="_blank">
                Resend
              </a>
            </li>
            <li>
              <a href="https://steadyhq.com/en/privacy" target="_blank">
                Steady
              </a>
            </li>
            <li>
              <a href="https://umami.is/privacy" target="_blank">
                Umami
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
