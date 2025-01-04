import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/globals.css';
import { AppNavigation } from '@/components/navigation';
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
  title: 'Civic Dashboard',
  description:
    'Accessing Toronto City Council decisions shouldn’t be difficult, but today it is. The Civic Dashboard simplifies this process, letting Toronto residents easily search what their councillors are voting on, how they voted, and the history of decisions on key topics. Stay informed and engaged with your local government like never before.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
