import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Raelo — Random Talks, Real Moments',
  description: 'Every stranger, a story. Discover someone new and have a real conversation.',
};

import { ToastContainer } from '@/components/ui/Toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'client-id-not-set';

  return (
    <html lang="en" className={nunito.variable}>
      <body
        className="antialiased min-h-screen flex flex-col"
        style={{ background: 'var(--background)', color: 'var(--foreground)', fontFamily: "'Nunito', sans-serif" }}
      >
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
          <ToastContainer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
