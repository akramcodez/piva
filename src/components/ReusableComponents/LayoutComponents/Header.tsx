'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';
import PurpleIcon from '../PurpleIcon';
import { Product, User } from '@prisma/client';
import CreateWebinarButton from '../CreateWebinarButton';
import { Plus } from 'lucide-react';
import Stripe from 'stripe';
import { toast } from 'sonner';

type Props = {
  user: User;
  stripeProducts: Product[] | [];
};

const Header = ({ user, stripeProducts }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const isStripeConnected = user.stripeConnectId;

  const handleCreateWebinarClick = () => {
    toast.warning(
      'Please connect your Stripe account in settings to create webinars.',
    );
    router.push('/settings');
  };

  return (
    <div className="w-full px-2 sm:px-4 pt-6 pb-3 sm:pt-8 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-2 sm:gap-4 bg-background">
      {pathname.includes('pipeline') ? (
        <Button
          className="animated-gradient-bg border border-border rounded-lg text-sm sm:text-base px-2 py-1 sm:px-3 sm:py-1.5"
          variant="outline"
          onClick={() => router.push('/webinars')}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-1 sm:ml-2">Webinars</span>
        </Button>
      ) : (
        <div
          className="animated-gradient-bg px-2 py-1 text-sm sm:text-base flex justify-center font-medium h-[35px]
         items-center rounded-lg border border-border capitalize"
        >
          {pathname.split('/')[1] || 'Home'}
        </div>
      )}
      <div className="flex gap-4 sm:gap-6 items-center flex-wrap">
        <PurpleIcon className="flex">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
        </PurpleIcon>
        {isStripeConnected ? (
          <CreateWebinarButton stripeProducts={stripeProducts} />
        ) : (
          <Button
            className="rounded-xl hover:cursor-pointer px-3 py-1.5
          border border-border bg-primary/10 backdrop-blur-sm text-primary
          hover:bg-primary-20 flex items-center gap-2"
            onClick={handleCreateWebinarClick}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm lg:text-base">Create Webinar</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
