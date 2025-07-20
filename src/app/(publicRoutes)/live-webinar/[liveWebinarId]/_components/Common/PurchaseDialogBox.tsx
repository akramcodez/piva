'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClientProduct } from '@/lib/type';
import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { buyProduct } from '@/actions/product';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: ClientProduct | null;
  userId: string;
  webinarId: string;
};

const PurchaseDialogBox = ({
  open,
  onOpenChange,
  product,
  userId,
  webinarId,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePurchaseClick = () => {
    if (!product) {
      toast.error('Product details not available.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = async () => {
    if (!product?.id) {
      toast.error('Product ID is missing.');
      return;
    }

    setLoading(true);
    try {
      const result = await buyProduct(product.id, userId, webinarId);

      if (result.success) {
        toast.success(result.message || 'Purchase successful!');
        setShowConfirmation(false);
        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast.error(result.message || 'Purchase failed.');
      }
    } catch (error: unknown) {
      console.error('Error during purchase:', error);
      toast.error('An unexpected error occurred during purchase.');
    } finally {
      setLoading(false);
    }
  };

  if (!product && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">
              Purchase Product
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-3">
              Product details could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end items-center mt-4 sm:mt-0">
            <DialogClose className="mr-2">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Product Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-3">
            Review the product details before proceeding with the purchase.
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex items-center space-x-4 py-4">
            <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden relative">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-base font-semibold text-card-foreground">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="text-base font-bold text-primary">
                {typeof product.price === 'number'
                  ? product.price.toFixed(2)
                  : 'N/A'}{' '}
                {product.currency}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-end items-center mt-4 sm:mt-0">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handlePurchaseClick} disabled={loading || !product}>
            Purchase
          </Button>
        </DialogFooter>
      </DialogContent>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">
              Verification
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-3">
              This action will initiate the Demo purchase process for &quot;
              {product?.name || 'this product'}&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end items-center mt-4 sm:mt-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleConfirmPurchase} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'OK'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default PurchaseDialogBox;
