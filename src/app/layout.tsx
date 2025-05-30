import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/globals.css';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://civicdashboard.ca'),
  title: 'Civic Dashboard',
  description:
    "Toronto City Council shouldn't feel complicated. We make it easy for Toronto residents to track councillor votes and get involved in local decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="cc44ac27-34a8-4561-8a0f-c0b448b090cd"
          // conservatively exclude search params and url hash so we don't accidentally log personal info if it ever gets stored there in the future (e.g. search text)
          data-exclude-search="true"
          data-exclude-hash="true"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
