'use client';

import { registerAttendee } from '@/actions/attendence';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { WebinarStatusEnum } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({
  webinarId,
  webinarStatus,
  onRegistered,
}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const { setAttendee } = useAttendeeStore();

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return 'Get Reminder';
      case WebinarStatusEnum.WAITING_ROOM:
        return 'Get Reminder';
      case WebinarStatusEnum.LIVE:
        return 'Join webinar';
      default:
        return 'Register';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerAttendee({
        email,
        name,
        webinarId,
      });

      if (!res.success) {
        throw new Error(res.message || 'Something went wrong');
      }

      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          callStatus: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? 'Successfully joined the webinar'
          : 'Successfully registered for webinar',
      );

      setEmail('');
      setName('');
      setSubmitted(true);

      setTimeout(() => {
        setIsOpen(false);

        if (webinarStatus === WebinarStatusEnum.LIVE) {
          router.refresh();
        }

        if (onRegistered) onRegistered();
      }, 1500);
    } catch (error) {
      console.error('Error while submitting waitlist details', error);
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? 'bg-red-600 hover:bg-700'
              : 'bg-primary hover:bg-primary/90'
          } rounded-md px-4 py-2 text-primary-foreground text-sm font-semibold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse"></span>
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border-0 bg-transparent"
        showCloseButton={false}
      >
        <DialogHeader className="flex justify-center items-center border border-input rounded-xl p-4 bg-background">
          <DialogTitle className="text-center text-lg font-semibold mb-4">
            {webinarStatus === WebinarStatusEnum.LIVE
              ? 'Join the Webinar'
              : 'Join the Waitlist'}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {!submitted && (
              <React.Fragment>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </React.Fragment>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || submitted}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  {webinarStatus === WebinarStatusEnum.LIVE
                    ? 'Joining...'
                    : 'Registering...'}
                </>
              ) : submitted ? (
                webinarStatus === WebinarStatusEnum.LIVE ? (
                  "YOU' are all set to join!"
                ) : (
                  "You've successfully joined"
                )
              ) : webinarStatus === WebinarStatusEnum.LIVE ? (
                'Join Now'
              ) : (
                'Join Waitlist'
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
