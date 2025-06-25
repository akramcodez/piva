'use client';

import { WebinarWithPresenter } from '@/lib/type';
import {
  useStreamVideoClient,
  Call,
  StreamCall,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import LiveWebinarView from '../Common/LiveWebinarView';

type Props = {
  username: string;
  callId: string;
  callType: string;
  webinar: WebinarWithPresenter;
  token: string;
};

const CustomLivestreamPlayer = ({
  username,
  callId,
  callType,
  webinar,
  token,
}: Props) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!client) return;
    const myCall = client.call(callType, callId);
    setCall(myCall);
    myCall.join({ create: true }).then(
      () => setCall(myCall),
      () => console.log('Failed to join the Call'),
    );
    return () => {
      // myCall.leave().catch((e) => {
      //   console.log('Failed to Leave Call', e);
      // });
      setCall(undefined);
    };
  }, [client, callId, callType]);

  if (!call) return null;

  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={true}
        webinar={webinar}
        username={username}
        userId={webinar.presenter.id}
        userToken={token}
        call={call}
      />
    </StreamCall>
  );
};

export default CustomLivestreamPlayer;
