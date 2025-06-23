'use server';

import { prismaClient } from '@/lib/prismaClient';
import { AttendanceData } from '@/lib/type';
import { AttendedTypeEnum, CtaTypeEnum } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const getWebinarAttendence = async (
  webinarId: string,
  options: {
    includeUsers?: boolean;
    userLimit?: number;
  } = { includeUsers: true, userLimit: 100 },
) => {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        ctaType: true,
        tags: true,
        presenter: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!webinar) {
      return { success: false, status: 404, message: 'Webinar not found' };
    }

    const attendanceCounts = await prismaClient.attendance.groupBy({
      by: ['attendedType'],
      where: { webinarId },
      _count: {
        attendedType: true,
      },
    });

    const result: Record<AttendedTypeEnum, AttendanceData> = {} as Record<
      AttendedTypeEnum,
      AttendanceData
    >;

    for (const type of Object.values(AttendedTypeEnum)) {
      if (
        type === AttendedTypeEnum.ADDED_TO_CART &&
        webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
      )
        continue;

      if (
        type === AttendedTypeEnum.BREAKOUT_ROOM &&
        webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
      )
        continue;

      const countItem = attendanceCounts.find((item) => {
        if (
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM &&
          item.attendedType === AttendedTypeEnum.ADDED_TO_CART
        ) {
          return true;
        }
        return item.attendedType === type;
      });

      result[type] = {
        count: countItem ? countItem._count.attendedType : 0,
        users: [],
      };
    }

    if (options.includeUsers) {
      for (const type of Object.values(AttendedTypeEnum)) {
        if (
          (type === AttendedTypeEnum.ADDED_TO_CART &&
            webinar.ctaType === CtaTypeEnum.BOOK_A_CALL) ||
          (type === AttendedTypeEnum.BREAKOUT_ROOM &&
            webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL)
        ) {
          continue;
        }
        const queryType =
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM
            ? AttendedTypeEnum.ADDED_TO_CART
            : type;

        if (result[type].count > 0) {
          const attendances = await prismaClient.attendance.findMany({
            where: {
              webinarId,
              attendedType: queryType,
            },
            include: {
              user: true,
            },
            take: options.userLimit,
            orderBy: {
              createdAt: 'desc',
            },
          });

          result[type].users = attendances.map((attendance) => ({
            id: attendance.user.id,
            name: attendance.user.name,
            email: attendance.user.email,
            attendedAt: attendance.joinedAt,
            stripeConnectId: null,
            callStatus: attendance.user.callStatus,
            createdAt: attendance.user.createdAt,
            updatedAt: attendance.user.updatedAt,
          }));
        }
      }
    }

    // revalidatePath(`/webinars/${webinarId}/pipeline`);
    return {
      success: true,
      data: result,
      ctaType: webinar.ctaType,
      tags: webinar.tags || [],
      presenter: webinar.presenter,
    };
  } catch (error) {
    console.error('Error fetching webinar attendance data:', error);
    return {
      success: false,
      message: 'Failed to fetch webinar attendance',
    };
  }
};

export const registerAttendee = async ({
  email,
  name,
  webinarId,
}: {
  email: string;
  name: string;
  webinarId: string;
}) => {
  try {
    if (!webinarId || !email) {
      return {
        success: false,
        status: 400,
        message: 'Missing required parameters',
      };
    }

    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    });
    if (!webinar) {
      return {
        success: false,
        status: 404,
        message: 'Webinar not found',
      };
    }

    let attendee = await prismaClient.attendee.findUnique({
      where: { email },
    });

    if (!attendee) {
      attendee = await prismaClient.attendee.create({
        data: { email, name },
      });
    }

    const existingAttendence = await prismaClient.attendance.findFirst({
      where: {
        attendeeId: attendee.id,
        webinarId: webinarId,
      },
      include: {
        user: true,
      },
    });

    if (existingAttendence) {
      return {
        success: true,
        status: 200,
        data: existingAttendence,
        message: 'You are already registered for this webinar',
      };
    }

    //create attendence record
    const attendance = await prismaClient.attendance.create({
      data: {
        attendedType: AttendedTypeEnum.REGISTERED,
        attendeeId: attendee.id,
        webinarId: webinarId,
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/${webinarId}`);

    return {
      success: true,
      status: 200,
      data: attendance,
      message: 'Successfully Registered',
    };
  } catch (error) {
    console.error('Registration Error:', error);
    return {
      success: false,
      status: 500,
      error: error,
      message: 'Something went wrong',
    };
  }
};

export const changeAttendenceType = async (
  attendeeId: string,
  webinarId: string,
  attendeeType: AttendedTypeEnum,
) => {
  try {
    const attendance = await prismaClient.attendance.update({
      where: {
        attendeeId_webinarId: {
          attendeeId,
          webinarId,
        },
      },
      data: {
        attendedType: attendeeType,
      },
    });

    return {
      success: true,
      status: 200,
      message: 'Attendance type updated sucessfully',
      data: attendance,
    };
  } catch (error) {
    console.error('Error updating attendence type: error');
    return {
      success: false,
      status: 500,
      message: 'Failed to update attendence type',
      error,
    };
  }
};
