'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { User } from '@prisma/client';
import CreateWebinarButton from '../CreateWebinarButton';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ClientProduct } from '@/lib/type';
import { Assistant } from '@vapi-ai/server-sdk/api';
import ProductDialog from '@/app/(protectedRoutes)/products/_components/ProductDialog';

type Props = {
  user: User;
  stripeProducts: ClientProduct[] | [];
  assistants: Assistant[] | [];
};

const Header = ({ user, stripeProducts, assistants }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const isStripeConnected = user.stripeConnectId;

  const handleCreateWebinarClick = () => {
    toast.warning(
      'Please connect your Stripe account in settings to create webinars',
    );
    router.push('/settings');
  };

  const handleCreateProductClick = () => {
    if (user.stripeConnectId) {
      setOpenDialog(true);
    } else {
      toast.warning(
        'Please connect your Stripe account in settings to create products',
      );
      router.push('/settings');
    }
  };

  const onProductCreated = () => {
    router.refresh();
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
          className="animated-gradient-bg px-3 py-1 text-sm sm:text-base flex justify-center font-medium h-[35px]
         items-center rounded-lg border border-border capitalize"
        >
          <button className="cursor-pointer" onClick={() => router.refresh()}>
            {pathname.split('/')[1] || 'Home'}
          </button>
        </div>
      )}
      <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
        {isStripeConnected ? (
          <Button
            className={`rounded-xl flex gap-2 items-center hover:cursor-pointer px-2 py-1
          border border-border backdrop-blur-sm text-primary ${
            user.stripeConnectId
              ? 'animated-gradient-bg'
              : 'bg-card hover:bg-muted'
          }`}
            onClick={handleCreateProductClick}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm lg:text-base">Product</span>
          </Button>
        ) : (
          <Button
            className="rounded-xl hover:cursor-pointer px-2 py-1
          border border-border bg-primary/10 backdrop-blur-sm text-primary
          hover:bg-primary-20 flex items-center gap-2"
            onClick={handleCreateProductClick}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm lg:text-base">Product</span>
          </Button>
        )}
        {isStripeConnected ? (
          <CreateWebinarButton
            stripeProducts={stripeProducts}
            assistants={assistants}
          />
        ) : (
          <Button
            className="rounded-xl hover:cursor-pointer px-2 py-1
          border border-border bg-primary/10 backdrop-blur-sm text-primary
          hover:bg-primary-20 flex items-center gap-2"
            onClick={handleCreateWebinarClick}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm lg:text-base">Webinar</span>
          </Button>
        )}
      </div>
      {openDialog && (
        <ProductDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          userId={user.id}
          onProductCreated={onProductCreated}
        />
      )}
    </div>
  );
};

export default Header;
