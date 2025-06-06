'use server';

import { WebinarFormState } from '@/store/useWebinarStore';
import { onAuthenticateUser } from './auth';
import { prismaClient } from '@/lib/prismaClient';
import { CtaTypeEnum } from '@prisma/client';
import { revalidatePath } from 'next/cache';

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormet: 'AM' | 'PM',
): Date {
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr || '0', 10);

  if (timeFormet === 'PM' && hours < 12) {
    hours += 12;
  } else if (timeFormet === 'AM' && hours === 12) {
    hours = 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticateUser();
    if (!user) {
      return { status: 401, message: 'Unauthorized' };
    }

    // todo
    // if(!user.user?.subscription) {
    //     return { status: 403, message: "Subcription Required" }
    // }

    const presenterId = user.user?.id;
    console.log('Form Data', formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return { status: 400, message: 'Webinar Name is required' };
    }

    if (!formData.basicInfo.date) {
      return { status: 400, message: 'Webinar Date is required' };
    }

    if (!formData.basicInfo.time) {
      return { status: 400, message: 'Webinar Time is required' };
    }

    const combinedDataTime = combineDateTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormet || 'AM',
    );
    const now = new Date();

    if (combinedDataTime < now) {
      return {
        status: 400,
        message: 'Webinar Date and Time must be in the future',
      };
    }

    const data: any = {
      title: formData.basicInfo.webinarName,
      description: formData.basicInfo.description || '',
      startTime: combinedDataTime,
      tags: formData.cta.tags || [],
      ctaType: formData.cta.ctaType as CtaTypeEnum,
      aiAgentId: formData.cta.aiAgent || null,
      priceId: formData.cta.priceId || null,
      lockChat: formData.additionalInfo.lockChat || false,
      couponCode: formData.additionalInfo.couponEnabled
        ? formData.additionalInfo.couponCode
        : null,
      couponEnabled: formData.additionalInfo.couponEnabled || false,
    };
    if (presenterId) {
      data.presenterId = presenterId;
    }

    const webinar = await prismaClient.webinar.create({
      data: data,
    });
    revalidatePath('/');
    return {
      status: 200,
      message: 'Webinar created successfully',
      webinarId: webinar.id,
      webinarLink: `/webinar/${webinar.id}`,
    };
  } catch (error) {
    console.error('Error creating webinar:', error);
    return { status: 500, message: 'Failed to create webinar' };
  }
};

export const getWebinarByPresenterId = async (presenterId: string) => {
  try {
    const webinars = await prismaClient.webinar.findMany({
      where: {
        presenterId: presenterId,
      },
      include: {
        presenter: {
          select: {
            id: true,
            stripeConnectId: true,
            email: true,
          },
        },
      },
    });
    return webinars;
  } catch (error) {
    console.error('Error fetching webinars:', error);
    return [];
  }
};
