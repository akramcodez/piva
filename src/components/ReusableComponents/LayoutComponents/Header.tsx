'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';
import PurpleIcon from '../PurpleIcon';

type User = {
  name: string;
  id: string;
  clerkId: string;
  email: string;
  profileImage: string;
  stripeConnectId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  subscription: boolean;
  stripeCustomerId: string | null;
};

type Props = {
  user: User;
};

const Header = ({ user }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full px-2 sm:px-4 pt-6 sm:pt-8 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-2 sm:gap-4 bg-background">
      {pathname.includes('pipeline') ? (
        <Button
          className="bg-primary/10 border border-border rounded-lg text-sm sm:text-base px-2 py-1 sm:px-3 sm:py-1.5 hover:bg-primary/20"
          variant="outline"
          onClick={() => router.push('/webinar')}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-1 sm:ml-2">Back</span>
        </Button>
      ) : (
        <div className="px-2 py-1 text-sm sm:text-base flex justify-center font-medium items-center rounded-lg bg-background border border-border text-primary capitalize">
          {pathname.split('/')[1] || 'Home'}
        </div>
      )}
      <div className="flex gap-4 sm:gap-6 items-center flex-wrap">
        <PurpleIcon className="flex">
          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
        </PurpleIcon>
      </div>
    </div>
  );
};

export default Header;
