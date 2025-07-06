import { getAttendeeById } from '@/actions/attendence';
import { getWebinarById } from '@/actions/webinar';
import { redirect } from 'next/navigation';
import React from 'react';
import { CallStatusEnum, WebinarStatusEnum } from '@prisma/client';

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    attendeeId: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { attendeeId } = await searchParams;

  if (!liveWebinarId || !attendeeId) {
    redirect('/404');
  }

  const attendee = await getAttendeeById(attendeeId, liveWebinarId);

  if (!attendee.data) {
    redirect(`/live-webinar/${liveWebinarId}?error=attendee-not-found`);
  }

  const webinar = await getWebinarById(liveWebinarId);

  if (!webinar) {
    redirect('/404');
  }

  if (
    webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ||
    webinar.webinarStatus === WebinarStatusEnum.SCHEDULED
  ) {
    redirect(`/live-webinar/${liveWebinarId}?error=webinar-not-started`);
  }

  if (
    webinar.ctaType !== 'BOOK_A_CALL' ||
    !webinar.aiAgentId ||
    !webinar.priceId
  ) {
    redirect(`/live-webinar/${liveWebinarId}?error=cannot-book-a-call`);
  }

  if (attendee.data.callStatus === CallStatusEnum.COMPLETED) {
    redirect(`live-webinar/${liveWebinarId}?error=call-not-pending`);
  }

  return <div>page</div>;
};

export default page;
