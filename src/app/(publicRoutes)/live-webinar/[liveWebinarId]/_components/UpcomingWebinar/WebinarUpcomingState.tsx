'use client';

import { Webinar, User } from '@prisma/client';
import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';

type Props = {
  webinar: Webinar;
  currentUser: User;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-full min-h-screen mx-auto max-w-[400px] flex flex-col justify-center items-center gap-6 py-20">
      <div className="space-y-4">
        <p className="text-3xl font-semibold text-primary text-center">
          Seems Like you are little early
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
