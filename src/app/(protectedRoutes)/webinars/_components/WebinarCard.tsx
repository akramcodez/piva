import { Webinar } from '@prisma/client';
import { format } from 'date-fns';
import { Calendar, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  webinar: Webinar;
};

const WebinarCard = ({ webinar }: Props) => {
  return (
    <div className="flex grid-3 flex-col items-start w-full">
      <Link href={`/live-webinar/${webinar?.id}`}>
        <Image
          src={'/darkthumbnail.png'}
          alt={'webinar'}
          height={100}
          width={400}
        />
      </Link>
      <div className="w-full flex justify-between gap-3 items-center">
        <Link
          href={`/live-webinar/${webinar?.id}`}
          className="flex flex-col gap-2 items-start"
        >
          <div>
            <p className="text-sm text-primary font-semibold">
              {webinar?.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {webinar?.description}
            </p>
          </div>
          <div className="flex gap-2 justify-start items-center">
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <Calendar size={15} />
              <p>{format(new Date(webinar?.startTime), 'dd/MM/yyyy')}</p>
            </div>
          </div>
        </Link>
        <Link
          href={`/webinars/${webinar?.id}/pipeline`}
          className="flex px-4 py-2 rounded-md border-[0.5px] border-border bg-secondary"
        >
          <Layers className="w-4 h-4 text-primary" />
        </Link>
      </div>
    </div>
  );
};

export default WebinarCard;
