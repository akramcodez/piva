'use server';

import { onAuthenticateUser } from './auth';
import { stripe } from '@/lib/stripe';

export const getAllProductsFromStripe = async () => {
  try {
    const currentUser = await onAuthenticateUser();
    if (!currentUser.user) {
      return {
        error: 'User not authenticated',
        status: 401,
        success: false,
      };
    }

    if (!currentUser.user.stripeCustomerId) {
      return {
        error: 'User does not have a Stripe customer ID',
        status: 401,
        success: false,
      };
    }

    const Products = await stripe.products.list(
      {},
      {
        stripeAccount: currentUser.user.stripeCustomerId,
      },
    );

    return {
      products: Products.data,
      success: true,
      status: 200,
    };
  } catch (error) {
    console.error('Error getting products from Stripe:', error);
    return {
      error: 'Failed getting products from Stripe',
      status: 500,
      success: false,
    };
  }
};
