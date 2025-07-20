'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  LucideAlertCircle,
  LucideArrowRight,
  LucideCheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { stripeDisconnect } from '@/actions/stripe';
import { useRouter } from 'next/navigation';

type Props = {
  isConnected: boolean;
  stripeLink: string;
  userId: string;
};

export const StripeConnectCard = ({
  isConnected,
  stripeLink,
  userId,
}: Props) => {
  const router = useRouter();

  const handleStripeDisconnect = async () => {
    try {
      const result = await stripeDisconnect(userId);
      if (result.success) {
        toast.success('Stripe Account Disconnected');
        router.refresh();
      } else {
        toast.error('Failed to Disconnect Stripe Account');
      }
    } catch (error: unknown) {
      console.error('Failed to Disconnect Stripe Account: ', error);
      toast.error('Server Failed to Disconnect Stripe Account');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold">Stripe Connect</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Process payments by connecting your Stripe account.
        </p>
        <div
          className={`p-3 rounded-md flex items-center gap-3 text-sm font-medium ${
            isConnected
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {isConnected ? (
            <LucideCheckCircle2 className="h-5 w-5" />
          ) : (
            <LucideAlertCircle className="h-5 w-5" />
          )}
          <span>
            {isConnected ? 'Account is connected' : 'Account is not connected'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Stripe will handle all payment processing, transfers, and refunds.
        </p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button
          asChild
          variant={isConnected ? 'outline' : 'default'}
          className="w-full sm:w-auto themeBg text-white hoverthemeBg"
        >
          <Link href={stripeLink}>
            {isConnected ? 'Reconnect' : 'Connect Stripe'}
            <LucideArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        {isConnected && (
          <Button
            type="submit"
            variant="destructive"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleStripeDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
};
