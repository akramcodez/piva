'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { prismaClient } from '@/lib/prismaClient';
import { revalidatePath } from 'next/cache';
import { addStripeId } from './stripe';

export async function onAuthenticateUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 403, user: null, message: 'User not authenticated' };
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { clerkId: user.id },
    });

    if (existingUser) {
      if (!existingUser.stripeConnectId) {
        try {
          await addStripeId(existingUser.id);
        } catch (error) {
          console.error('Failed to add Stripe ID to existing user:', error);
        }
      }
      return { status: 200, user: existingUser };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(' ') || 'No Name';

    const userData = {
      clerkId: user.id,
      email: userEmail || `clerk_${user.id}@temp.com`,
      name: userName,
      profileImage: user.imageUrl,
    };

    const newUser = await createUserWithEmailConflictHandling(userData);

    try {
      await addStripeId(newUser.id);
      console.log('Stripe ID added successfully for user:', newUser.id);
    } catch (stripeError) {
      console.error('Failed to add Stripe ID:', stripeError);
    }

    return { status: 201, user: newUser };
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    return {
      status: 500,
      user: null,
      message: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

async function createUserWithEmailConflictHandling(userData: {
  clerkId: string;
  email: string;
  name: string;
  profileImage: string;
}) {
  try {
    return await prismaClient.user.create({ data: userData });
  } catch (error: any) {
    if (error.code === 'P2002' && userData.email.includes('@')) {
      const existingUser = await prismaClient.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        return await prismaClient.user.update({
          where: { id: existingUser.id },
          data: {
            clerkId: userData.clerkId,
            name: userData.name,
            profileImage: userData.profileImage,
          },
        });
      }
    }

    const uniqueEmail = `${userData.clerkId}_${Date.now()}@temp.com`;
    return await prismaClient.user.create({
      data: { ...userData, email: uniqueEmail },
    });
  }
}

export async function deleteAccount() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error(
        'User not found. You must be logged in to delete your account.',
      );
    }

    const client = await clerkClient();
    const userInDb = await prismaClient.user.findUnique({
      where: { clerkId: user.id },
    });

    // Delete from Clerk regardless
    await client.users.deleteUser(user.id);

    // If user exists in database, clean up all related data
    if (userInDb) {
      await prismaClient.$transaction([
        prismaClient.product.deleteMany({ where: { ownerId: userInDb.id } }),
        prismaClient.webinar.deleteMany({
          where: { presenterId: userInDb.id },
        }),
        prismaClient.user.delete({ where: { id: userInDb.id } }),
      ]);
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Account and all associated data deleted successfully.',
    };
  } catch (error: unknown) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the account.',
    };
  }
}
