'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function JwtExpiryHandler({
  jwtExpired,
  children,
}: {
  jwtExpired: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  if (!jwtExpired) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center w-full h-[80vh]">
      <div className="bg-card p-6 rounded-lg border border-border max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          Session Expired
        </h2>
        <p className="mb-6 text-muted-foreground">
          Your AI agent authentication has expired. You need to refresh to
          continue.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Refresh Session
        </Button>
      </div>
    </div>
  );
}
