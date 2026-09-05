import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addStripeId, stripeDisconnect } from '../stripe';
import { prismaClient } from '@/lib/prismaClient';

vi.mock('@/lib/prismaClient');
const prismaMock = prismaClient as any;

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Stripe Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addStripeId', () => {
    it('should return 400 if user ID is missing', async () => {
      const result = await addStripeId('');
      expect(result).toEqual({
        status: 400,
        success: false,
        message: 'User ID is required',
      });
    });

    it('should return 200 and existing ID if Stripe is already connected', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        stripeConnectId: 'acct_existing',
      });

      const result = await addStripeId('user-1');
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { stripeConnectId: true },
      });
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Stripe account already connected',
        stripeConnectId: 'acct_existing',
      });
      expect(prismaMock.user.update).not.toHaveBeenCalled();
    });

    it('should connect demo Stripe ID and enable subscription if not connected', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        stripeConnectId: null,
      });

      prismaMock.user.update.mockResolvedValue({
        stripeConnectId: 'acct_demo_123',
        subscription: true,
      });

      const result = await addStripeId('user-2');
      
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-2' },
        data: expect.objectContaining({
          stripeConnectId: expect.stringMatching(/^acct_demo_[a-f0-9]+$/),
          subscription: true,
        }),
      });

      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Demo Stripe account connected successfully',
        stripeConnectId: 'acct_demo_123',
      });
    });

    it('should handle database errors gracefully', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('DB Error'));

      const result = await addStripeId('user-3');
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Failed to connect demo Stripe account',
      });
    });
  });

  describe('stripeDisconnect', () => {
    it('should return 400 if user ID is missing', async () => {
      const result = await stripeDisconnect('');
      expect(result).toEqual({
        status: 400,
        success: false,
        message: 'User is missing',
      });
    });

    it('should disconnect stripe account and disable subscription', async () => {
      prismaMock.user.update.mockResolvedValue({});

      const result = await stripeDisconnect('user-1');
      
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { stripeConnectId: null, subscription: false },
      });

      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Stripe Account Disconnected',
      });
    });

    it('should handle errors gracefully during disconnect', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('DB Error'));

      const result = await stripeDisconnect('user-1');
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Failed to disconnect stripeAccount',
      });
    });
  });
});
