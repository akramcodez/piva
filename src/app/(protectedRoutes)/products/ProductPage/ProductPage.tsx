'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Product, User } from '@prisma/client';
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

type Props = {
  user: User;
  products: any[];
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

  const displayedProducts = products;

  return (
    <div className="h-full w-full space-y-5 p-3">
      <div className="w-full p-1 sm:space-x-5 space-y-3 flex sm:flex-row sm:items-start flex-col items-center">
        <h3 className="text-primary sm:text-3xl text-2xl font-semibold">
          ALL Your Products
        </h3>
        <Button
          className={`sm:w-auto w-[100%] text-md font-semibold text-white iconBackground cursor-pointer ${
            user.stripeConnectId ? 'iconBackground' : 'bg-card'
          }`}
          onClick={handleCreateProductClick}
        >
          Create Product
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length > 0 ? ( // Check length of the prop array
          displayedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
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

              <CardContent className="p-4 flex flex-col flex-grow text-sm">
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
                    {/* toFixed will work now because price is a number */}
                    <span className="text-primary font-semibold">
                      {product.price.toFixed(2)} {product.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Status:
                    </span>
                    <span
                      className={`font-semibold ${
                        product.status === 'ACTIVE'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {product.status}
                    </span>
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
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-card-foreground">
                      Webinar:
                    </span>
                    <span className="text-card-foreground">
                      {product.webinarId ? 'Linked' : 'Not Linked'}{' '}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No products found. Create one to get started!
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
