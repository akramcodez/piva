'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { prismaClient } from '@/lib/prismaClient';
import { revalidatePath } from 'next/cache';

export async function onAuthenticateUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        status: 403,
      };
    }

    const userExists = await prismaClient.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (userExists) {
      return {
        status: 200,
        user: userExists,
      };
    }

    const newUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || 'no-email-provided',
        name: user.firstName + ' ' + user.lastName,
        profileImage: user.imageUrl,
      },
    });

    if (!newUser) {
      return {
        status: 500,
        message: 'Something went wrong',
      };
    }

    return {
      status: 201,
      user: newUser,
    };
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Internal server error',
    };
  }
}

export async function deleteAccount() {
  try {
    const client = await clerkClient();

    const user = await currentUser();

    if (!user) {
      throw new Error(
        'User not found. You must be logged in to delete your account.',
      );
    }

    const userInDb = await prismaClient.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!userInDb) {
      await client.users.deleteUser(user.id);
      return { success: true, message: 'Clerk user deleted.' };
    }

    await prismaClient.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: {
          ownerId: userInDb.id,
        },
      });

      await tx.webinar.deleteMany({
        where: {
          presenterId: userInDb.id,
        },
      });

      await tx.user.delete({
        where: {
          id: userInDb.id,
        },
      });
    });

    await client.users.deleteUser(user.id);

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
