'use client';

import { Webinar, User, WebinarStatusEnum } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTimer';
import Image from 'next/image';
import WaitListComponent from './WaitListComponent';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { changeWebinarStatus } from '@/actions/webinar';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { createAndStartStream } from '@/actions/streamIo';

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState('');
  const router = useRouter();

  const selectImg = () => {
    const num = Math.floor(Math.random() * 10) + 1;
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

  const handleStartWebinar = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      await createAndStartStream(webinar);
      const res = await changeWebinarStatus(webinar.id, 'LIVE');
      if (!res.status) {
        throw new Error(res.message);
      }

      toast.success('Webinar started successfully');
      router.refresh();
    } catch (error: unknown) {
      console.error('Error starting webinar:', error);
      if (
        error instanceof Error &&
        error.message === 'You already have a live stream running'
      ) {
        toast.error(
          'You already have another live webinar running. Please end it before starting this one.',
        );
      } else {
        toast.error('Something went wrong while starting the webinar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto max-w-[400px] flex flex-col justify-center items-center gap-4 py-18 px-3">
      <div className="space-y-4">
        <p className="text-2xl font-semibold text-primary text-center">
          <i>Seems Like You are Little Early</i>
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
          <>
            {currentUser?.id === webinar?.presenterId ? (
              <Button
                className="w-full max-w-[300px] font-semibold"
                onClick={handleStartWebinar}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Starting...
                  </>
                ) : (
                  'Start Webinar'
                )}
              </Button>
            ) : (
              <WaitListComponent
                webinarId={webinar.id}
                webinarStatus="WAITING_ROOM"
              />
            )}
          </>
        ) : webinar?.webinarStatus === WebinarStatusEnum.LIVE ? (
          <WaitListComponent webinarId={webinar.id} webinarStatus="LIVE" />
        ) : webinar?.webinarStatus === WebinarStatusEnum.CANCELLED ? (
          <p className="text-xl text-foreground text-center font-semibold">
            Webinar is Cancelled
          </p>
        ) : (
          <Button>Ended</Button>
        )}
      </div>

      <div className="text-center space-y-2.5">
        <h3 className="text-xl font-semibold text-primary">{webinar.title}</h3>
        <p className="text-muted-foreground text-xs">{webinar.description}</p>
        <div className="w-full justify-center flex gap-2 flex-wrap items-center">
          <Button
            variant={'outline'}
            className="rounded-md bg-secondary hover-bg-secondary backdrop-blur-2xl"
          >
            <Calendar className="mr-2" />
            {format(new Date(webinar.startTime), 'dd MMMM yyyy')}
          </Button>
          <Button variant={'outline'}>
            <Clock className="mr-2" />
            {format(new Date(webinar.startTime), 'hh:mm a')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
