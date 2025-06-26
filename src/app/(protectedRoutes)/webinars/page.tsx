import { onAuthenticateUser } from '@/actions/auth';
import { getWebinarByPresenterId } from '@/actions/webinar';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, WebcamIcon, Layers } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import WebinarCard from './_components/WebinarCard';
import { Webinar, WebinarStatusEnum } from '@prisma/client';

//todo : fix the tab trigger style

type Props = {
  searchParams: Promise<{
    webinarStatus: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const { webinarStatus } = await searchParams;
  const checkUser = await onAuthenticateUser();
  if (!checkUser) {
    redirect('/');
  }

  const webinars = await getWebinarByPresenterId(
    checkUser?.user?.id ?? '',
    webinarStatus as WebinarStatusEnum,
  );

  const filterWebinars = (webinars: Webinar[], type: 'upcoming' | 'ended') => {
    const currentTime = new Date();
    return webinars?.filter((webinar) => {
      const webinarTime = new Date(webinar.startTime);
      return type === 'upcoming'
        ? webinarTime > currentTime
        : webinarTime < currentTime;
    });
  };

  const upcomingWebinars = filterWebinars(webinars, 'upcoming');
  const endedWebinars = filterWebinars(webinars, 'ended');

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<UserRound className="w-3 h-3" />}
        mainIcon={<WebcamIcon className="w-12 h-12" />}
        rightIcon={<Layers className="w-4 h-4" />}
        heading="ALL Your Webinars"
        placeholder="Search Option..."
      >
        <TabsList className="bg-transparent space-x-3 flex justify-evenly">
          <TabsTrigger
            value="all"
            className="bg-secondary opcaity-50 data-[state=active]:opacity-100 px-6 py-4"
          >
            All
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="bg-secondary px-6 py-4">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="ended" className="bg-secondary px-6 py-4">
            Ended
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        {webinars?.length > 0 ? (
          webinars.map((webinar: Webinar, index: number) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div
            className="w-full h=[200px] flex justify-center items-center
            text-primary font-semibold text-2xl col-span-12"
          >
            No Webinar Found
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="upcoming"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4  gap-x-6 gap-y-10"
      >
        {upcomingWebinars?.length > 0 ? (
          upcomingWebinars.map((webinar: Webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Upcoming Webinars
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="ended"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
      >
        {endedWebinars?.length > 0 ? (
          endedWebinars.map((webinar: Webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Ended Webinars
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Page;
