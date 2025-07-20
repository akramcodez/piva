'use client';

import React, { useEffect } from 'react';
import { User, WebinarStatusEnum } from '@prisma/client';
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState';
import { usePathname, useRouter } from 'next/navigation';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { toast } from 'sonner';
import LiveStreamState from './LiveWebinar/LiveStreamState';
import { ClientProduct, WebinarWithPresenter } from '@/lib/type';
import Participant from './Participant/Participant';

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: WebinarWithPresenter;
  apiKey: string;
  product?: ClientProduct | null;
};

const RenderWebinar = ({ error, user, webinar, apiKey, product }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { attendee } = useAttendeeStore();

  useEffect(() => {
    toast.error(error);
    router.push(pathname);
  }, [error, pathname, router]);

  return (
    <React.Fragment>
      {webinar.webinarStatus === 'LIVE' ? (
        <React.Fragment>
          {user?.id === webinar.presenterId ? (
            <LiveStreamState
              apiKey={apiKey}
              webinar={webinar}
              callId={webinar.id}
              user={user}
              product={product}
            />
          ) : attendee ? (
            <Participant
              apiKey={apiKey}
              webinar={webinar}
              callId={webinar.id}
              product={product}
            />
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
              This Webinar has been cancelled
            </p>
          </div>
        </div>
      ) : webinar.webinarStatus === WebinarStatusEnum.ENDED ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-semibold text-primary">
              {webinar?.title}
            </h3>
            <p className="text-muted-foreground text-xl">
              This webinar has Ended. No recording is available
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
