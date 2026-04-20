import type { Metadata } from 'next';
import { Epilogue, IBM_Plex_Sans } from 'next/font/google';
import '@/app/globals.css';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-sans',
});
const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
  variable: '--font-epilogue',
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
    <html lang="en" className={`${ibmPlexSans.variable} ${epilogue.variable}`}>
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
      <body className={`antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
