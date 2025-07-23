import { onAuthenticateUser } from '@/actions/auth';
import { getWebinarByPresenterId } from '@/actions/webinar';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UserRound,
  WebcamIcon,
  Layers,
  AlertTriangle,
  Phone,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import WebinarCard from './_components/WebinarCard';
import { Webinar, WebinarStatusEnum } from '@prisma/client';
import { getProductsByOwnerId } from '@/actions/product';
import { ClientProduct } from '@/lib/type';
import { getAllAssistants } from '@/actions/vapi';

type Props = {
  searchParams: Promise<{
    webinarStatus: string;
  }>;
};

const page = async ({ searchParams }: Props) => {
  const { webinarStatus } = await searchParams;
  const checkUser = await onAuthenticateUser();
  if (!checkUser) {
    redirect('/');
  }

  if (!checkUser?.user) {
    redirect('/sign-in');
  }

  const serverWebinars = await getWebinarByPresenterId(
    checkUser?.user?.id ?? '',
    webinarStatus as WebinarStatusEnum,
  );

  const filterWebinars = (webinars: Webinar[], type: 'upcoming' | 'ended') => {
    const currentTime = new Date();
    return webinars?.filter((webinar) => {
      const webinarTime = new Date(webinar.startTime);

      if (type === 'upcoming') {
        return webinarTime > currentTime;
      } else {
        return (
          webinarTime < currentTime &&
          (webinar.webinarStatus === WebinarStatusEnum.ENDED ||
            webinar.webinarStatus === WebinarStatusEnum.CANCELLED)
        );
      }
    });
  };

  const sortWebinars = (
    webinars: Webinar[],
    type: 'all' | 'upcoming' | 'ended',
  ) => {
    if (!webinars || webinars.length === 0) return webinars;

    return webinars.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      const currentTime = new Date().getTime();

      const aIsOverdue =
        timeA < currentTime &&
        a.webinarStatus !== WebinarStatusEnum.ENDED &&
        a.webinarStatus !== WebinarStatusEnum.CANCELLED;
      const bIsOverdue =
        timeB < currentTime &&
        b.webinarStatus !== WebinarStatusEnum.ENDED &&
        b.webinarStatus !== WebinarStatusEnum.CANCELLED;

      if (aIsOverdue && !bIsOverdue) return -1;
      if (!aIsOverdue && bIsOverdue) return 1;

      if (aIsOverdue && bIsOverdue) {
        return timeA - timeB;
      }

      switch (type) {
        case 'upcoming':
          return timeA - timeB;

        case 'ended':
          return timeB - timeA;

        case 'all':
          const aIsUpcoming = timeA > currentTime;
          const bIsUpcoming = timeB > currentTime;

          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;

          if (aIsUpcoming && bIsUpcoming) {
            return timeA - timeB;
          } else {
            return timeB - timeA;
          }

        default:
          return 0;
      }
    });
  };

  const upcomingWebinars = sortWebinars(
    filterWebinars(serverWebinars, 'upcoming'),
    'upcoming',
  );
  const endedWebinars = sortWebinars(
    filterWebinars(serverWebinars, 'ended'),
    'ended',
  );
  const webinars = sortWebinars(serverWebinars, 'all');

  const products = await getProductsByOwnerId(checkUser.user?.id);

  const productsForClient: ClientProduct[] = products.map((product) => ({
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  const allAgents = await getAllAssistants();

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<UserRound className="w-3 h-3" />}
        mainIcon={<WebcamIcon className="w-12 h-12" />}
        rightIcon={<Layers className="w-4 h-4" />}
        heading="ALL Your Webinars"
        placeholder="Search Option..."
      >
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 py-4 text-sm">
          <div className="flex items-center gap-1 text-blue-600">
            <Phone className="w-4 h-4 mr-1" />
            <span className="font-semibold">
              {checkUser.user?.bookACallWebinarsLimit || 0}
            </span>
            <span>Book-a-Call Webinar creation left</span>
          </div>
          <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="text-xs ">
              Sorry, Piva have limited VAPI credits
            </span>
          </div>
        </div>
        <TabsList className="bg-transparent space-x-2 flex justify-evenly">
          <TabsTrigger
            value="all"
            className="bg-secondary opcaity-50 data-[state=active]:opacity-100 px-4 py-3"
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
            <WebinarCard
              key={index}
              webinar={webinar}
              webinarStatus={
                webinar.startTime < new Date() &&
                webinar.webinarStatus !== WebinarStatusEnum.ENDED &&
                webinar.webinarStatus !== WebinarStatusEnum.CANCELLED
                  ? 2
                  : webinar.startTime > new Date()
                  ? 1
                  : 0
              }
              products={productsForClient}
              assistants={allAgents?.data || []}
            />
          ))
        ) : (
          <div
            className="w-full h=[200px] flex justify-center items-center
            text-muted-foreground font-semibold text-2xl col-span-12"
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
            <WebinarCard
              key={webinar.id}
              webinar={webinar}
              webinarStatus={1}
              products={productsForClient}
              assistants={allAgents?.data || []}
            />
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
            <WebinarCard
              key={webinar.id}
              webinar={webinar}
              webinarStatus={0}
              products={productsForClient}
              assistants={allAgents?.data || []}
            />
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

export default page;
