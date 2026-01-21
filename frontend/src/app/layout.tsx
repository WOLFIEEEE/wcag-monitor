import type { Metadata, Viewport } from 'next';
import { ColorSchemeScript } from '@mantine/core';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'WCAG Monitor - Accessibility Testing Made Easy',
    template: '%s | WCAG Monitor',
  },
  description: 'Monitor your website accessibility with automated WCAG testing. Get alerts, reports, and trends.',
  keywords: ['accessibility', 'wcag', 'a11y', 'testing', 'monitoring', 'web accessibility'],
  authors: [{ name: 'WCAG Monitor Team' }],
  creator: 'WCAG Monitor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://monitor.thewcag.com',
    siteName: 'WCAG Monitor',
    title: 'WCAG Monitor - Accessibility Testing Made Easy',
    description: 'Monitor your website accessibility with automated WCAG testing. Get alerts, reports, and trends.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG Monitor - Accessibility Testing Made Easy',
    description: 'Monitor your website accessibility with automated WCAG testing. Get alerts, reports, and trends.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
