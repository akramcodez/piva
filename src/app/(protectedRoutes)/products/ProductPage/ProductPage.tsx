'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { User } from '@prisma/client';
import { RefreshCw } from 'lucide-react';
import ProductDialog from '../_components/ProductDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClientProduct } from '@/lib/type';
import { changeStatusOfProduct } from '@/actions/product';

type Props = {
  user: User;
  products: ClientProduct[];
};

const ProductPage = ({ user, products }: Props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleCreateProductClick = () => {
    if (user.stripeConnectId) {
      setOpenDialog(true);
    } else {
      toast.warning(
        'Please connect your Stripe account in settings to create products.',
      );
      router.push('/settings');
    }
  };

  const onProductCreated = () => {
    router.refresh();
  };

  const changeStatus = async (productId: string) => {
    try {
      const res = await changeStatusOfProduct(productId);

      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error('Error in changeStatus client function:', error);
      toast.error('An unexpected error occurred while changing status.');
    }
  };

  const displayedProducts = products;

  return (
    <div className="h-full w-full space-y-5 p-3">
      <div className="w-full p-1 sm:space-x-5 space-y-3 flex sm:flex-row sm:items-start flex-col items-center">
        <h3 className="text-primary sm:text-3xl text-2xl font-semibold">
          ALL Your Products
        </h3>
        <Button
          className={`sm:w-auto w-[100%] text-md font-semibold text-white cursor-pointer mt-0.5 ${
            user.stripeConnectId
              ? 'iconBackground'
              : 'bg-card hover:bg-muted border border-border'
          }`}
          onClick={handleCreateProductClick}
        >
          Create Product
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <Card
              key={product.id}
              className={`overflow-hidden flex flex-col pt-0 pb-3 ${
                product.status === 'ACTIVE'
                  ? 'border-[2px] border-green-500'
                  : 'border-[2px] border-red-500'
              }`}
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-40 bg-muted">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-4 flex flex-col flex-grow text-sm">
                <CardTitle className="text-base font-semibold text-card-foreground mb-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mb-3 line-clamp-3 flex-grow">
                  {product.description}
                </CardDescription>
                <div className="mt-auto space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Price:
                    </span>
                    <span className="text-primary font-semibold">
                      {typeof product.price === 'number'
                        ? product.price.toFixed(2)
                        : 'N/A'}{' '}
                      {product.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Status:
                    </span>
                    <div
                      className={`font-semibold flex ${
                        product.status === 'ACTIVE'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      <span className="mr-1.5">{product.status}</span>
                      <RefreshCw
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => changeStatus(product.id)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Total Sales:
                    </span>
                    <span className="text-card-foreground">
                      {product.totalSales}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Created:
                    </span>
                    <span className="text-card-foreground">
                      {format(new Date(product.createdAt), 'MMM dd, yyyy')}{' '}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="pl-2 col-span-full text-left text-muted-foreground text-xl">
            No Products Available
          </div>
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

export default ProductPage;
