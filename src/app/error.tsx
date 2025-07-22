'use client';

import ErrorFallback from '@/components/ErrorBoundary/ErrorFallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      resetError={reset}
      title="Oops! Something Went Wrong"
      description="We encountered an unexpected issue while processing your request. Our team has been automatically notified and is working on a fix."
    />
  );
}
