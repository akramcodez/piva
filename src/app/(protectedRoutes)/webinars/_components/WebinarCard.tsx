'use client';

import { deleteWebinar } from '@/actions/webinar';
import { Button } from '@/components/ui/button';
import { Webinar } from '@prisma/client';
import { format } from 'date-fns';
import {
  Calendar,
  Layers,
  Loader2,
  Trash2,
  Edit,
  MoreVertical,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditWebinarDialog from './EditWebinarDialog';
import { ClientProduct } from '@/lib/type';
import { Assistant } from '@vapi-ai/server-sdk/api';

type Props = {
  webinar: Webinar;
  products: ClientProduct[] | [];
  assistants: Assistant[] | [];
};

const WebinarCard = ({ webinar, products, assistants }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editDialog, setEditDialog] = React.useState(false);

  const handleDeleteWebinar = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteWebinar(webinar?.id);
      if (result.status === 200) {
        toast.success('Webinar deleted successfully');
      } else {
        toast.error(result.message || 'Failed to delete webinar');
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
    <div className="flex flex-col items-start w-full group">
      <div className="w-full relative">
        <Link href={`/live-webinar/${webinar?.id}`} className="w-full">
          <div className="w-full h-full flex items-center">
            <div className="w-full h-45 relative rounded-xl overflow-hidden mb-4 border-[3px] hoverthemeBorder">
              <Image
                src={
                  webinar.thumbnail ? `${webinar.thumbnail}` : '/webinar.jpg'
                }
                alt={'webinar'}
                fill
                className="object-cover blur1px transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </Link>
      </div>

      <div className="w-full flex justify-between gap-3 items-start px-2">
        <Link
          href={`/live-webinar/${webinar?.id}`}
          className="flex flex-col gap-2 items-start flex-1"
        >
          <div>
            <p className="text-sm text-primary font-semibold line-clamp-2">
              {webinar?.title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {webinar?.description}
            </p>
          </div>
          <div className="flex gap-2 justify-start items-center">
            <div className="flex gap-2 items-center text-xs text-muted-foreground">
              <Calendar size={14} />
              <p>{format(new Date(webinar?.startTime), 'dd/MM/yyyy')}</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={`/webinars/${webinar?.id}/pipeline`}
            className="flex px-3 py-1.5 rounded-md border-[0.5px] border-border bg-secondary hoverthemeBgLight transition-colors"
          >
            <Layers className="w-4 h-4 text-primary" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-1.5 h-auto border-[0.5px] border-border bg-secondary hoverthemeBgLight"
              >
                <MoreVertical className="w-4 h-4 text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setEditDialog(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Webinar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteWebinar}
                className="text-red-600 focus:text-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="text-red-600 w-4 h-4 mr-2" />
                )}
                Delete Webinar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {editDialog && (
        <EditWebinarDialog
          webinar={webinar}
          isOpen={editDialog}
          onClose={() => setEditDialog(false)}
          products={products}
          assistants={assistants}
        />
      )}
    </div>
  );
};

export default WebinarCard;
