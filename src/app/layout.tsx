import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import { Manrope, Ubuntu } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
});

export const metadata: Metadata = {
  title: 'Piva',
  description: 'AI-Powered Webinar Platform',
  authors: [{ name: 'SK Akram', url: 'https://x.com/akramcodez' }],
  keywords: [
    // Core Platform Keywords
    'AI webinar platform',
    'automated webinar software',
    'live webinar hosting',
    'webinar automation',
    'AI-powered presentations',
    'interactive webinars',

    // Sales & Marketing
    'automated sales funnel',
    'webinar sales automation',
    'lead generation webinars',
    'conversion optimization',
    'sales webinar platform',
    'marketing automation',

    // Technology Features
    'real-time chat integration',
    'AI chatbot webinars',
    'voice AI integration',
    'stream chat',
    'live streaming platform',
    'video conferencing',

    // Business Solutions
    'SaaS webinar platform',
    'business webinar software',
    'online presentation tool',
    'virtual events platform',
    'digital marketing tools',
    'customer engagement',

    // AI & Tech Stack
    'artificial intelligence',
    'machine learning webinars',
    'Next.js application',
    'React webinar platform',
    'TypeScript',
    'Prisma database',

    // Integration Keywords
    'Stripe integration',
    'payment processing',
    'Clerk authentication',
    'Vapi.ai integration',
    'API integration',
    'webhook automation',

    // Industry Terms
    'webinar monetization',
    'online course platform',
    'digital product sales',
    'e-learning platform',
    'virtual training',
    'remote presentations',
  ],
  openGraph: {
    title: 'Piva - AI-Powered Webinar Platform',
    description:
      'Create AI-enhanced webinars with automated sales and real-time engagement',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piva - AI-Powered Webinar Platform',
    description:
      'Create AI-enhanced webinars with automated sales and real-time engagement',
    creator: '@akramcodez',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${manrope.variable} ${ubuntu.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
