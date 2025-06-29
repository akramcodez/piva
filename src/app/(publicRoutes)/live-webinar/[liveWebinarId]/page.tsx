import { onAuthenticateUser } from '@/actions/auth';
import { getWebinarById } from '@/actions/webinar';
import React from 'react';
import RenderWebinar from './_components/RenderWebinar';
import { WebinarWithPresenter } from '@/lib/type';

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { error } = await searchParams;

  const webinarData = (await getWebinarById(
    liveWebinarId,
  )) as WebinarWithPresenter;

  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        Webinar Not Found
      </div>
    );
  }
  const checkUser = await onAuthenticateUser();

  //TODO: Create api keys
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string; //check

  return (
    <div className="w-full h-screen ">
      <RenderWebinar
        error={error}
        user={checkUser.user || null}
        webinar={webinarData}
        apiKey={apiKey}
      />
    </div>
  );
};

export default Page;
