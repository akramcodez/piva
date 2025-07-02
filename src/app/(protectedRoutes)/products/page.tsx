import React from 'react';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import ProductPage from './ProductPage/ProductPage';
import { getProductsByOwnerId } from '@/actions/product';
import { Product, User } from '@prisma/client'; // Import Product and User types (needed for the 'products' variable)
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal type

type Props = {};

const Page = async (props: Props) => {
  const userExist = await onAuthenticateUser();

  if (!userExist?.user) {
    redirect('/sign-in');
  }

  const products = await getProductsByOwnerId(userExist.user.id);

  const productsForClient = products.map((product) => ({
    ...product,
    price:
      product.price instanceof Decimal
        ? product.price.toNumber()
        : product.price,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  return <ProductPage user={userExist.user} products={productsForClient} />;
};

export default Page;
