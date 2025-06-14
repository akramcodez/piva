import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from '@stream-io/video-react-sdk';
import { WebinarWithPresenter } from '@/lib/type';
import { User } from '@prisma/client';
import React from 'react';

type Props = {
  apikey: string;
  token: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
};

const hostUser: StreamUser = { id: process.env.NEXT_PUBLIC_STREAM_USER_ID! };

const LiveStreamState = ({ apikey, token, callId, webinar, user }: Props) => {
  return <div>LiveStreamState</div>;
};

export default LiveStreamState;
