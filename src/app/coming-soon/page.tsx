import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon – Civic Dashboard',
};

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 pb-2">
              Coming Soon
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
              Our friendly neighbourhood volunteers are hard at work building
              this page. Please check back soon!
            </p>

            <div className="animate-bounce">
              <span className="text-4xl">🏗️</span>
            </div>

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
  );
}
