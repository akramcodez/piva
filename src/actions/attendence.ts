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
              webinar: {
                include: {
                  presenter: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  callStatus: true,
                },
              },
            },
            take: options.userLimit,
            orderBy: {
              createdAt: 'desc',
            },
          });

          result[type].users = attendances
            .map((attendance) => {
              if (!attendance.user || !attendance.webinar?.presenter) {
                console.error(
                  `Missing required relations for attendance ${attendance.id}`,
                );
                return null;
              }

              return {
                id: attendance.user.id,
                name: attendance.user.name,
                email: attendance.user.email,
                attendedAt: attendance.joinedAt,
                stripeConnectId: null,
                callStatus: attendance.user.callStatus,
              };
            })
            .filter((user): user is NonNullable<typeof user> => user !== null);
        }
      }
    }

    // revalidatePath(`/webinars/${webinarId}/pipeline`);
    return {
      success: true,
      data: result,
      ctaType: webinar.ctaType,
      tags: webinar.tags || [],
    };
  } catch (error) {
    console.error('Error fetching webinar attendance data:', error);
    return {
      success: false,
      message: 'Failed to fetch webinar attendance',
    };
  }
};

//check here error comes in future
// result[type].users = attendances
//             .map((attendance) => ({

//               return {
//                 id: attendance.user.id,
//                 name: attendance.user.name,
//                 email: attendance.user.email,
//                 attendedAt: attendance.joinedAt,
//                 stripeConnectId: null,
//                 callStatus: attendance.user.callStatus,
//               }
//             }))
