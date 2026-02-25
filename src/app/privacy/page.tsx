import { Metadata } from 'next';
import { BulletedList, Heading1, Heading2 } from '@/components/ui/text-items';
import { ArticlePage } from '@/components/ui/page';
import { Section } from '@/components/ui/section';

export const metadata: Metadata = {
  title: 'Privacy Policy – Civic Dashboard',
};

export default function Privacy() {
  return (
    <ArticlePage>
      <Section>
        <Heading1>Privacy Policy</Heading1>
        <p>
          We strive to keep this page up to date with a simple explanation of
          what data about you we store or send to 3rd parties as part of
          operating Civic Dashboard! This project is nascent, and we're aware we
          need to flesh this out more.{' '}
          <a href="/feedback" className="classic-link">
            Let us know how we can do better!
          </a>
        </p>
      </Section>
      <Section>
        <Heading2>Data you submit to us for our features to work</Heading2>
        <p>
          If you subscribe to a search on the actions page, we will store your
          email address along with the associated search filters.
        </p>
      </Section>
      <Section>
        <Heading2>Data we collect to help us improve Civic Dashboard</Heading2>
        <p>
          We store analytics data alongside an anonimyzed time-bound identifier
          with{' '}
          <a href="https://umami.is/" target="_blank" className="classic-link">
            Umami
          </a>
          . We make this data{' '}
          <a
            href="https://eu.umami.is/share/6R9CNotgCUNEmDL5/civicdashboard.ca"
            target="_blank"
            className="classic-link"
          >
            public
          </a>{' '}
          for transparency and accountability, and so that the value of this
          data, which was created by the public, can be used by the public as
          well.
        </p>

        <p>
          That means the pages you view and significant actions you take on the
          website (but NOT any content you submit to the website) will be stored
          alongside an identifier that can't be linked back to you, and which is
          changed every month.
        </p>

        <p>
          For example, we may store that you viewed our home page, then actions
          page, then filtered by certain tags, then submitted a comment to
          council, but NOT what that comment was.
        </p>
      </Section>
      <Section>
        <Heading2>Full list of 3rd party providers</Heading2>
        <p>
          Additionally, the 3rd party providers we use to host the website and
          send emails have their own privacy policies. These providers are:
        </p>
        <BulletedList>
          <li>
            <a
              href="https://www.cloudflare.com/en-ca/privacypolicy"
              target="_blank"
              className="classic-link"
            >
              Cloudflare
            </a>
          </li>
          <li>
            Sevalla, a service provided by{' '}
            <a
              href="https://kinsta.com/legal/privacy-policy/"
              target="_blank"
              className="classic-link"
            >
              Kinsta
            </a>
          </li>
          <li>
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              className="classic-link"
            >
              Resend
            </a>
          </li>
          <li>
            <a
              href="https://steadyhq.com/en/privacy"
              target="_blank"
              className="classic-link"
            >
              Steady
            </a>
          </li>
          <li>
            <a
              href="https://umami.is/privacy"
              target="_blank"
              className="classic-link"
            >
              Umami
            </a>
          </li>
        </BulletedList>
      </Section>
    </ArticlePage>
  );
}
