import { AttendedTypeEnum } from '@prisma/client';

export const formatColumnTitle = (type: AttendedTypeEnum): string => {
  switch (type) {
    case AttendedTypeEnum.REGISTERED:
      return 'Registered';
    case AttendedTypeEnum.ATTENDED:
      return 'Attended';
    case AttendedTypeEnum.ADDED_TO_CART:
      return 'Added to Cart';
    case AttendedTypeEnum.FOLLOW_UP:
      return 'Follow Up';
    case AttendedTypeEnum.BREAKOUT_ROOM:
      return 'Breakout Room';
    case AttendedTypeEnum.CONVERTED:
      return 'Converted';
    default:
      return type;
  }
};
