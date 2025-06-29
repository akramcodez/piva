'use server';

import { Attendee, Webinar } from '@prisma/client';
import { getStreamClient } from '@/lib/stream/streamClient';
import { UserRequest } from '@stream-io/node-sdk';
import { prismaClient } from '@/lib/prismaClient';

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const newUser: UserRequest = {
      id: attendee?.id || 'guest',
      role: 'user',
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

export const getTokenForHost = async (
  userId: string,
  username: string,
  profilePic: string,
) => {
  try {
    const newUser: UserRequest = {
      id: userId,
      role: 'user',
      name: username || 'Guest',
      image:
        profilePic ||
        `https://api.dicebear.com/7.x/initails/svg?seed=${username}`,
    };
    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });

    return token;
  } catch (err) {
    console.error('Error generating Stream Io Token', err);
    throw new Error('Failed to generate Stream Io token');
  }
};

export const createAndStartStream = async (webinar: Webinar) => {
  try {
    const checkWebinar = await prismaClient.webinar.findMany({
      where: {
        presenterId: webinar.presenterId,
        webinarStatus: 'LIVE',
      },
    });

    if (checkWebinar.length > 0) {
      throw new Error('You already have a live stream running');
    }

    const call = getStreamClient.video.call('livestream', webinar.id);

    // Create the call
    await call.getOrCreate({
      data: {
        created_by_id: webinar.presenterId,
        members: [
          {
            user_id: webinar.presenterId,
            role: 'host',
          },
        ],
      },
    });

    await call.goLive();

    // await prismaClient.webinar.update({
    //   where: { id: webinar.id },
    //   data: { webinarStatus: 'LIVE' },
    // });  //check

    console.log('Stream created and started successfully');
    return { success: true, callId: webinar.id };
  } catch (err) {
    console.error('Error creating and starting stream: ', err);
    throw new Error('Failed to create and start stream');
  }
};
