import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WebinarWithPresenter } from '@/lib/type';
import { ChevronRight, Loader2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  purchase?: boolean;
  setPurchaseDialog?: (purchase: boolean) => void;
  trigger?: React.ReactNode;
  webinar: WebinarWithPresenter;
  userId: string;
};

const CTADialogBox = ({
  open,
  onOpenChange,
  purchase,
  setPurchaseDialog,
  trigger,
  webinar,
  userId,
}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      if (webinar?.ctaType === 'BOOK_A_CALL') {
        router.push(`/live-webinar/${webinar.id}/call?attendeeId=${userId}`);
      } else {
        if (setPurchaseDialog) {
          setPurchaseDialog(!purchase);
        }
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    } catch (error: unknown) {
      console.log('Error in book call or buy dialog', error);
      toast.error(
        `Failed To Open ${
          webinar?.ctaType === 'BOOK_A_CALL' ? 'Another Page' : 'Product Dialog'
        }`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {webinar?.ctaType === 'BOOK_A_CALL' ? 'BOOK_A_CALL' : 'Buy Now'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-3">
            {webinar?.ctaType === 'BOOK_A_CALL'
              ? 'You will be redirected to a call on another page'
              : 'Product details will open in a new dialog'}
          </p>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <div className="flex mt-4 space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/80 shadow-inner border border-zinc-600 flex items-center justify-center">
                <ShoppingCart className="text-white w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium">{webinar.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {webinar.description}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end items-center mt-4 sm:mt-0">
          <DialogClose className="mr-2">Close</DialogClose>
          <Button
            onClick={handleClick}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : webinar?.ctaType === 'BOOK_A_CALL' ? (
              'Join Break-room'
            ) : (
              'Buy Now'
            )}{' '}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CTADialogBox;
