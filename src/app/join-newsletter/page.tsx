import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Join Our Newsletter – Civic Dashboard',
};

export default function JoinNewsletter() {
  return (
    <>
      <Script
        type="text/javascript"
        src="https://steadyhq.com/widget_loader/31c21613-2a90-46e0-bfba-8ed5534e730f"
        strategy="lazyOnload"
      ></Script>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 pb-2">
                Join our Newsletter
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
                We’re building this project out in the open—and you’re invited
                to be part of it.
                <br />
                <br />
                Subscribe for occasional updates on what we’re working on, what
                we’re learning, and where we need your input. From
                behind-the-scenes reflections to feature updates and community
                calls-to-action, you’ll get it all in your inbox.
                <br />
                <br />
              </p>

              <div id="steady_newsletter_signup_embed"></div>

              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
