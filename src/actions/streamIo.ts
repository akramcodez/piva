'use server';

import { Attendee } from '@prisma/client';
import { getStreamClient } from '@/lib/stream/streamClient';
import { UserRequest } from '@stream-io/video-react-sdk';

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const newUser: UserRequest = {
      id: attendee?.id || 'guest',
      //TODO: ADD ROLE
      name: attendee?.name || 'Guest',
      image: `https://api.dicebear.com/7.x/initails/svg?seed=${
        attendee?.name || 'Guest'
      }`,
    };
    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: attendee?.id || 'guest',
      validity_in_seconds: validity,
    });

    return token;
  } catch (error) {
    console.error('Error generating Stream IO token', error);
    throw new Error('Failed to generate Stream IO token');
  }
};
