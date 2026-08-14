import { vi, describe, it, expect, beforeEach } from 'vitest';
import { onAuthenticateUser, deleteAccount } from '../auth';
import { prismaClient } from '@/lib/prismaClient';
import * as clerkNextjsServer from '@clerk/nextjs/server';

vi.mock('@/lib/prismaClient');
const prismaMock = prismaClient as any;

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
  clerkClient: vi.fn(),
}));

vi.mock('../stripe', () => ({
  addStripeId: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Auth Actions', () => {
  const mockClerkUser = {
    id: 'clerk-id-123',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'Test',
    lastName: 'User',
    imageUrl: 'profile.jpg',
  };

  const mockDbUser = {
    id: 'db-id-123',
    clerkId: 'clerk-id-123',
    email: 'test@example.com',
    name: 'Test User',
    profileImage: 'profile.jpg',
    subscription: false,
    bookACallWebinarsLimit: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('onAuthenticateUser', () => {
    it('should return 403 if user is not authenticated in Clerk', async () => {
      vi.spyOn(clerkNextjsServer, 'currentUser').mockResolvedValue(null);

      const result = await onAuthenticateUser();
      expect(result).toEqual({ status: 403, user: null, message: 'User not authenticated' });
    });

    it('should return existing user if found in database', async () => {
      vi.spyOn(clerkNextjsServer, 'currentUser').mockResolvedValue(mockClerkUser as any);
      prismaMock.user.findUnique.mockResolvedValue(mockDbUser as any);

      const result = await onAuthenticateUser();
      expect(result).toEqual({ status: 200, user: mockDbUser });
    });

    it('should create new user if not found in database', async () => {
      vi.spyOn(clerkNextjsServer, 'currentUser').mockResolvedValue(mockClerkUser as any);
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(mockDbUser as any);

      const result = await onAuthenticateUser();
      expect(result).toEqual({ status: 201, user: mockDbUser });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          clerkId: 'clerk-id-123',
          email: 'test@example.com',
          name: 'Test User',
          profileImage: 'profile.jpg',
        },
      });
    });
  });
});
