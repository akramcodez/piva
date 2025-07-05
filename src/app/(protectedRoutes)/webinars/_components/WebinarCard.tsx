'use client';

import { deleteWebinar } from '@/actions/webinar';
import { Button } from '@/components/ui/button';
import { Webinar } from '@prisma/client';
import { format } from 'date-fns';
import { Calendar, Layers, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  webinar: Webinar;
};

const WebinarCard = ({ webinar }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteWebinar = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteWebinar(webinar?.id);
      if (result.status === 200) {
        toast.success('Webinar deleted successfully');
      } else {
        toast.error(result.message || 'Failed to deleted webinar');
      }
      router.refresh();
    } catch (error) {
      console.error('Error deleting webinar:', error);
      toast.error('An error occurred while deleting the webinar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex grid-3 flex-col items-start w-full">
      <Link href={`/live-webinar/${webinar?.id}`} className="w-full">
        <div className="w-full h-full flex items-center">
          <div className="w-full h-45 relative rounded-xl overflow-hidden mb-4 border-[3px] hoverthemeBorder">
            <Image
              src={'/webinar.jpg'}
              alt={'webinar'}
              fill
              className="object-cover blur1px"
            />
          </div>
        </div>
      </Link>
      <div className="w-full flex justify-between gap-3 items-start px-2">
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
        <div className="space-y-2">
          <Link
            href={`/webinars/${webinar?.id}/pipeline`}
            className="flex px-3 py-1.5 rounded-md border-[0.5px] border-border bg-secondary hoverthemeBgLight"
          >
            <Layers className="w-4 h-4 text-primary" />
          </Link>
          <Button
            onClick={handleDeleteWebinar}
            className="flex px-3 py-1.5 rounded-md border-[0.5px] border-border bg-red-900/50 hover:bg-red-800"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebinarCard;
