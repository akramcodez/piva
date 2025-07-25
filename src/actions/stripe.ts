'use server';

import { prismaClient } from '@/lib/prismaClient';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export const addStripeId = async (userId: string) => {
  try {
    if (!userId) {
      return {
        status: 400,
        success: false,
        message: 'User ID is required',
      };
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { stripeConnectId: true },
    });

    if (existingUser?.stripeConnectId) {
      return {
        status: 200,
        success: true,
        message: 'Stripe account already connected',
        stripeConnectId: existingUser.stripeConnectId,
      };
    }

    const demoStripeId = `acct_demo_${uuidv4().replace(/-/g, '')}`;

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { stripeConnectId: demoStripeId, subscription: true },
    });

    return {
      status: 200,
      success: true,
      message: 'Demo Stripe account connected successfully',
      stripeConnectId: updatedUser.stripeConnectId,
    };
  } catch (error: unknown) {
    console.error('Failed to add demo Stripe ID:', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to connect demo Stripe account',
    };
  }
};

export const stripeDisconnect = async (id: string) => {
  try {
    if (!id) {
      return {
        status: 400,
        success: false,
        message: 'User is missing',
      };
    }

    await prismaClient.user.update({
      where: { id: id },
      data: { stripeConnectId: null, subscription: false },
    });

    revalidatePath('/settings');

    return {
      status: 200,
      success: true,
      message: 'Stripe Account Disconnected',
    };
  } catch (error: unknown) {
    console.error('Failed to disconnect stripeAccount: ', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to disconnect stripeAccount',
    };
  }
};

// export const getAllProductsFromStripe = async () => {
//   try {
//     const currentUser = await onAuthenticateUser();
//     if (!currentUser.user) {
//       return {
//         error: 'User not authenticated',
//         status: 401,
//         success: false,
//       };
//     }

//     if (!currentUser.user.stripeCustomerId) {
//       return {
//         error: 'User does not have a Stripe customer ID',
//         status: 401,
//         success: false,
//       };
//     }

//     const Products = await stripe.products.list(
//       {},
//       {
//         stripeAccount: currentUser.user.stripeCustomerId,
//       },
//     );

//     return {
//       products: Products.data,
//       success: true,
//       status: 200,
//     };
//   } catch (error: unknown) {
//     console.error('Error getting products from Stripe:', error);
//     return {
//       error: 'Failed getting products from Stripe',
//       status: 500,
//       success: false,
//     };
//   }
// };

// export const createCheckoutLink = async (
//   priceId: string,
//   stripeId: string,
//   attendeeId: string,
//   webinarId: string,
//   bookCall: boolean = false,
// ) => {
//   try {
//     const session = await stripe.checkout.sessions.create(
//       {
//         line_items: [
//           {
//             price: priceId,
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
//         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
//         metadata: {
//           attendeeId: attendeeId,
//           webinarId: webinarId,
//         },
//       },
//       {
//         stripeAccount: stripeId,
//       },
//     );

//     if (bookCall) {
//       await changeAttendenceType(attendeeId, webinarId, 'ADDED_TO_CART');
//     }

//     return {
//       success: true,
//       status: 200,
//       sessionUrl: session.url,
//     };
//   } catch (error: unknown) {
//     console.log('Error creating checkout link', error);
//     return {
//       error: 'Error creating checkout link',
//       status: 500,
//       success: false,
//     };
//   }
// };
