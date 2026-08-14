import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createWebinar, updateWebinar, getWebinarById, deleteWebinar } from '../webinar';
import { prismaClient } from '@/lib/prismaClient';
import { onAuthenticateUser } from '../auth';
import { CtaTypeEnum, WebinarStatusEnum } from '@prisma/client';

vi.mock('@/lib/prismaClient');
const prismaMock = prismaClient as any;

vi.mock('../auth', () => ({
  onAuthenticateUser: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Webinar Actions', () => {
  const mockUser = {
    id: 'user-id-123',
    clerkId: 'clerk-id',
    email: 'test@example.com',
    name: 'Test User',
    profileImage: '',
    subscription: true,
    bookACallWebinarsLimit: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    stripeConnectId: null,
    stripeCustomerId: null,
    lastLoginAt: new Date()
  };

  const mockFormData = {
    basicInfo: {
      webinarName: 'Test Webinar',
      description: 'Test Description',
      thumbnail: 'thumbnail.jpg',
      date: new Date('2026-08-15'),
      time: '10:00',
      timeFormat: 'AM' as 'AM' | 'PM',
    },
    cta: {
      tags: ['tag1'],
      ctaLabel: 'Click Here',
      ctaType: 'BUY_NOW' as CtaTypeEnum,
      aiAgent: null,
      priceId: null,
    },
    additionalInfo: {
      lockChat: false,
      couponEnabled: false,
      couponCode: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createWebinar', () => {
    it('should return 401 if user is not authenticated', async () => {
      vi.mocked(onAuthenticateUser).mockResolvedValue(null as any);

      const result = await createWebinar(mockFormData as any);
      expect(result).toEqual({ status: 401, message: 'Unauthorized' });
    });

    it('should return 402 if user has no subscription', async () => {
      vi.mocked(onAuthenticateUser).mockResolvedValue({
        status: 200,
        user: { ...mockUser, subscription: false },
      } as any);

      const result = await createWebinar(mockFormData as any);
      expect(result).toEqual({ status: 402, message: 'Subscription Required' });
    });

    it('should return 400 if book a call limit is reached', async () => {
      vi.mocked(onAuthenticateUser).mockResolvedValue({
        status: 200,
        user: { ...mockUser, bookACallWebinarsLimit: 0 },
      } as any);

      const formDataWithBookCall = {
        ...mockFormData,
        cta: { ...mockFormData.cta, ctaType: 'BOOK_A_CALL' },
      };

      const result = await createWebinar(formDataWithBookCall as any);
      expect(result).toEqual({
        status: 400,
        message: 'You have reached your limit for Book-a-Call webinars. Please upgrade your plan.',
      });
    });

    it('should create a webinar successfully', async () => {
      vi.mocked(onAuthenticateUser).mockResolvedValue({
        status: 200,
        user: mockUser,
      } as any);

      const createdWebinar = { id: 'webinar-id-123' };
      
      // Setup transaction mock
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });
      
      prismaMock.webinar.create.mockResolvedValue(createdWebinar as any);

      const result = await createWebinar(mockFormData as any);

      expect(prismaMock.webinar.create).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'Webinar created successfully',
        webinarId: 'webinar-id-123',
        webinarLink: '/webinar/webinar-id-123',
      });
    });
  });

  describe('deleteWebinar', () => {
    it('should delete webinar successfully', async () => {
      prismaMock.webinar.delete.mockResolvedValue({ id: 'webinar-id-123' } as any);

      const result = await deleteWebinar('webinar-id-123');

      expect(prismaMock.webinar.delete).toHaveBeenCalledWith({
        where: { id: 'webinar-id-123' },
      });
      expect(result.success).toBe(true);
    });
  });
});
