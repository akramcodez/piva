import { onAuthenticateUser } from '@/actions/auth';
import { getStripeOAuthLink } from '@/lib/stripe/util';
import { prismaClient } from '@/lib/prismaClient';
import {
  LucideAlertCircle,
  LucideArrowRight,
  LucideCheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import React from 'react';
import { Button } from '@/components/ui/button';

const page = async () => {
  const userExist = await onAuthenticateUser();

  if (!userExist.user) {
    redirect('/sign-in');
  }

  const isConnected = !!userExist?.user?.stripeConnectId;

  const stripeLink = getStripeOAuthLink(
    'api/stripe-connect',
    userExist.user.id,
  );

  const removeStripeId = async () => {
    'use server';

    try {
      await prismaClient.user.update({
        where: { id: userExist.user.id },
        data: {
          stripeConnectId: null,
          subscription: false,
        },
      });
    } catch (error) {
      console.error('Failed to remove Stripe Connect ID:', error);
      throw error;
    } finally {
      revalidatePath('/settings');
    }
  };

  return (
    <div className="w-full mx-auto px-4">
      <h1 className="text-md lg:text-2xl font-bold">
        DEMO Payment Integration
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        This is just a demo — no actual charges will be made.
      </p>
      <div className="w-full p-4 lg:p-5 border border-input rounded-lg bg-background shadow-sm">
        <div className="flex items-center mb-4">
          <div
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 
  flex items-center justify-center mr-4 flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-[24px] sm:h-[24px]"
            >
              <path
                d="M12 2L8.91 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L15.09 8.26L12 2Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-primary text-md lg:text-xl">
              Stripe Connect
            </h2>
            <p className="text-muted-foreground text-xs lg:text-sm">
              Connect your Stripe account to accept payments
            </p>
          </div>
        </div>

        <div className="my-4 p-4 bg-muted rounded-md">
          <div className="flex items-start">
            <div className="mt-2">
              {isConnected ? (
                <LucideCheckCircle2
                  className="h-4 w-4 lg:h-5 lg:w-5 text-green-500 
                mt-0.5 mr-3 flex-shrink-0"
                />
              ) : (
                <LucideAlertCircle
                  className="h-4 w-4 lg:h-5 lg:w-5 text-red-700 
                mt-0.5 mr-3 flex-shrink-0"
                />
              )}
            </div>
            <div>
              <p className="font-medium mb-0.5 leading-tight lg:text-xl text-sm">
                {isConnected
                  ? 'Your Stripe account is connected'
                  : 'Your Stripe account is not connected yet'}
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {isConnected
                  ? 'You can now accept payments through your application'
                  : 'Connect your Stripe account to start processing payments and managing subscriptions'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-start justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {isConnected
              ? 'You can reconnect anytime if needed'
              : "You'll be redirected to Stripe to complete the connection"}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={stripeLink}
              className={`px-5 py-2.5 rounded-md font-medium text-sm 
            flex items-center justify-center gap-2 transition-colors ${
              isConnected
                ? 'bg-muted hoverthemeBgLight text-foreground'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-600 text-white'
            }`}
            >
              <span className="flex items-center gap-2">
                {isConnected ? 'Reconnect' : 'Connect with Stripe'}
                <LucideArrowRight className="w-4 h-4" />
              </span>
            </Link>
            {isConnected && (
              <form action={removeStripeId}>
                <Button
                  type="submit"
                  className="bg-red-900 hover:bg-red-700 text-white w-full"
                >
                  Disconnect from Stripe
                </Button>
              </form>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="mt-6 pt-6 border-t border-border w-full">
            <h3 className="text-sm font-medium mb-2">
              Why Connect with Stripe?
            </h3>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Process payments securely from customers worldwide
              </li>
              <li className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Manage subscriptions and recurring billing
              </li>
              <li className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                </div>
                Access detailed financial reporting and analytics
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
