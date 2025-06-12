import React from 'react';
import { User, WebinarStatusEnum } from '@prisma/client';
import { Webinar } from '@prisma/client';
import WebinarUpcomingState from './UpcomingWebinar/WebinarUpcomingState';

type Props = {
  error: string | undefined;
  user: User | null;
  webinar: Webinar;
  apikey: string;
  token: string;
  callId: string;
};

const RenderWebinar = ({
  error,
  user,
  webinar,
  apikey,
  token,
  callId,
}: Props) => {
  return (
    // TODO: build waiting room and live webinar
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED && user ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
