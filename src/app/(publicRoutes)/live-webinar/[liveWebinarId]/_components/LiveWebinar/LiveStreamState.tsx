'use client';

import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from '@stream-io/video-react-sdk';
import { ClientProduct, WebinarWithPresenter } from '@/lib/type';
import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import CustomLivestreamPlayer from './CustomLivestreamPlayer';
import { getTokenForHost } from '@/actions/streamIo';

type Props = {
  apiKey: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
  product?: ClientProduct | null;
};

const LiveStreamState = ({ apiKey, callId, webinar, user, product }: Props) => {
  const [hostToken, setHostToken] = useState<string | null>();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage,
        );

        const hostUser: StreamUser = {
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage,
        };

        const streamClient = new StreamVideoClient({
          apiKey,
          user: hostUser,
          token,
        });

        setHostToken(token);
        setClient(streamClient);
      } catch (error: unknown) {
        console.log('Error initializating Stream Client: ', error);
      }
    };
    init();
  }, [apiKey, webinar]);

  if (!client || !hostToken) return null;

  return (
    <StreamVideo client={client}>
      <CustomLivestreamPlayer
        callId={callId}
        callType="livestream"
        webinar={webinar}
        username={user.name}
        token={hostToken}
        product={product}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
