'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
  showErrorId?: boolean;
}

const ErrorFallback = ({
  error,
  resetError,
  title = 'Service Temporarily Unavailable',
  description = 'We apologize for the inconvenience. Our team has been automatically notified and is working to resolve this issue.',
  showErrorId = process.env.NODE_ENV === 'development',
}: ErrorFallbackProps) => {
  const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  React.useEffect(() => {
    if (error) {
      console.error(`[${errorId}]`, error);
    }
  }, [error, errorId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {showErrorId && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Reference ID:</strong> {errorId}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Please include this ID when contacting support
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRefresh}
            variant="default"
            size="lg"
            className="font-semibold"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/" className="font-semibold">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need assistance? Contact with{' '}
            <Link
              href="https://x.com/akramcodez"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Akram
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
