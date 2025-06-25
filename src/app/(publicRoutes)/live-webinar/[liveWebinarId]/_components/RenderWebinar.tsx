'use client';

import React, { useEffect } from 'react';
import { User, WebinarStatusEnum } from '@prisma/client';
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState';
import { usePathname, useRouter } from 'next/navigation';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { toast } from 'sonner';
import LiveStreamState from './LiveWebinar/LiveStreamState';
import { WebinarWithPresenter } from '@/lib/type';
import Participant from './Participant/Participant';

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: WebinarWithPresenter;
  apikey: string;
};

const RenderWebinar = ({
  error,
  user,
  webinar,
  apikey,
  token,
  callId,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { attendee } = useAttendeeStore();

  useEffect(() => {
    toast.error(error);
    router.push(pathname);
  }, [error]);

  return (
    // TODO: build waiting room and live webinar
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
        // TODO: Add liveStream component and webinar stuff
        <React.Fragment>
          {user?.id === webinar.presenterId ? (
            <LiveStreamState
              apikey={apikey}
              token={token}
              callId={callId}
              webinar={webinar}
              user={user}
            />
          ) : attendee ? (
            //TODO: participant component
            <Participant apikey={apikey} webinar={webinar} callId={callId} />
          ) : (
            <WebinarUpcomingState
              webinar={webinar}
              currentUser={user || null}
            />
          )}
        </React.Fragment>
      ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-primary">
              {webinar?.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              This Webinar has been Cancelled
            </p>
          </div>
        </div>
      ) : (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
