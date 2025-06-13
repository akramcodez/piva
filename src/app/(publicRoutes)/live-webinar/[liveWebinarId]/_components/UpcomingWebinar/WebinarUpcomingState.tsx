'use client';

import { Webinar, User, WebinarStatusEnum } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import Image from 'next/image';
import WaitListComponent from './WaitListComponent';

type Props = {
  webinar: Webinar;
  currentUser: User;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState('');

  const selectImg = () => {
    let num = Math.floor(Math.random() * 10) + 1;
    if (num <= 3) {
      setPic('/webinarImg.jpg');
    } else if (num > 3 && num <= 5) {
      setPic('/webinarImg2.jpg');
    } else if (num > 5 && num <= 7) {
      setPic('/webinarImg3.jpg');
    } else {
      setPic('/webinarImg4.jpg');
    }
  };

  useEffect(() => {
    selectImg();
  }, []);

  return (
    <div className="w-full min-h-screen mx-auto max-w-[400px] flex flex-col justify-center items-center gap-4 py-18 px-3">
      <div className="space-y-4">
        <p className="text-2xl font-semibold text-primary text-center">
          Seems Like you are little early
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>
      <div className="space-y-4 w-full h-[50%] flex justify-center items-center flex-col">
        <div className="w-full max-w-md aspect-[4/3] relative rounded-xl overflow-hidden mb-4 border border-border">
          {pic && (
            <Image
              src={pic}
              alt={webinar.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        {webinar?.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
          <WaitListComponent webinarId={webinar.id} webinarStatus="SCHEDULED" />
        ) : webinar?.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
          <>{currentUser?.id === webinar?.presenterId ? '' : ''}</>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
