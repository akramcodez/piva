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
  metadataBase: new URL("https://piva.akramcodez.tech"),
  authors: [
    {
      name: "SK Akram",
      url: "https://github.com/akramcodez",
    },
  ],
  keywords: [
    'AI webinar platform',
    'automated webinar software',
    'live webinar hosting',
    'webinar automation',
    'AI-powered presentations',
    'interactive webinars',
    'automated sales funnel',
    'webinar sales automation',
    'lead generation webinars',
    'conversion optimization',
    'sales webinar platform',
    'marketing automation',
    'real-time chat integration',
    'AI chatbot webinars',
    'voice AI integration',
    'stream chat',
    'live streaming platform',
    'video conferencing',
    'SaaS webinar platform',
    'business webinar software',
    'online presentation tool',
    'virtual events platform',
    'digital marketing tools',
    'customer engagement',
    'artificial intelligence',
    'machine learning webinars',
    'Next.js application',
    'React webinar platform',
    'TypeScript',
    'Prisma database',
    'Stripe integration',
    'payment processing',
    'Clerk authentication',
    'Vapi.ai integration',
    'API integration',
    'webhook automation',
    'webinar monetization',
    'online course platform',
    'digital product sales',
    'e-learning platform',
    'virtual training',
    'remote presentations',
  ],
  creator: "SK Akram",
  publisher: "SK Akram",
  openGraph: {
    title: 'Piva',
    description:
      'AI-Powered Webinar Platform',
    url: "https://piva.akramcodez.tech",
    siteName: "SK Akram",
    images: [
      {
        url: "https://piva.akramcodez.tech/og-main-image.jpg",
        width: 1200,
        height: 630,
        alt: "SK Akram Portfolio",
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piva',
    description:
      'AI-Powered Webinar Platform',
    images: ["https://piva.akramcodez.tech/og-main-image.jpg"],
    creator: "@akramcodez",
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
