import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Podcast Guest CRM',
    template: '%s | Podcast Guest CRM',
  },
  description:
    'AI-native CRM for podcast hosts and booking agencies. Manage the full guest lifecycle from discovery to post-episode follow-up.',
  keywords: ['podcast', 'CRM', 'guest management', 'AI', 'booking'],
  authors: [
    { name: 'Rudrendu Paul' },
    { name: 'Sourav Nandy' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
