import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/globals.css';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

const headingFont = localFont({
  src: './fonts/Epilogue-Variable.ttf',
  variable: '--font-heading',
  weight: '400 900',
  display: 'swap',
});

const bodyFont = localFont({
  src: './fonts/IBMPlexSans-Variable.ttf',
  variable: '--font-body',
  weight: '100 700',
  display: 'swap',
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
  openGraph: {
    images: {
      url: '/toronto.jpg',
      type: 'image/jpeg',
      width: 628,
      height: 540,
    },
  },
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
        className={`${headingFont.variable} ${bodyFont.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
