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
import { addStripeId, stripeDisconnect } from '@/actions/stripe';
import { useRouter } from 'next/navigation';

type Props = {
  isConnected: boolean;
  userId: string;
};

export const StripeConnectCard = ({ isConnected, userId }: Props) => {
  const router = useRouter();

  const handleConnect = async () => {
    try {
      const result = await addStripeId(userId);
      if (result.success) {
        toast.success('Demo Stripe Account Connected');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to connect demo Stripe account');
      }
    } catch (error: unknown) {
      console.error('Failed to Connect Demo Stripe Account: ', error);
      toast.error('Server Failed to Connect Demo Stripe Account');
    }
  };

  const handleStripeDisconnect = async () => {
    try {
      const result = await stripeDisconnect(userId);
      if (result.success) {
        toast.success('Demo Stripe Account Disconnected');
        router.refresh();
      } else {
        toast.error('Failed to Disconnect Demo Stripe Account');
      }
    } catch (error: unknown) {
      console.error('Failed to Disconnect Demo Stripe Account: ', error);
      toast.error('Server Failed to Disconnect Demo Stripe Account');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold">Demo Stripe Connect</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-1">
          <Link href="https://x.com/akramcodez" className=" text-blue-500">
            Akram
          </Link>{' '}
          has created a demo Stripe Connect integration for testing purposes
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
          Demo Stripe account is compulsory to create webinars and products
        </p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button
          variant={isConnected ? 'outline' : 'default'}
          className="w-full sm:w-auto themeBg text-white hoverthemeBg"
          onClick={handleConnect}
        >
          {isConnected ? 'Reconnect' : 'Connect Stripe'}
          <LucideArrowRight className="w-4 h-4 ml-2" />
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
