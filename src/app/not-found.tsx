import React from 'react';
import { Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BackButton } from '@/components/ErrorBoundary/BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow-lg">
            <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            The page you&apos;re looking for seems to have vanished into the
            digital void. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg" className="font-semibold">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
          </Button>
          <BackButton />
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Still can&apos;t find what you&apos;re looking for?{' '}
            <Link
              href="https://x.com/akramcodez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
