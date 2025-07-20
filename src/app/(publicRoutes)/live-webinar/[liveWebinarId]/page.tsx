import { onAuthenticateUser } from '@/actions/auth';
import { getWebinarById } from '@/actions/webinar';
import React from 'react';
import RenderWebinar from './_components/RenderWebinar';
import { WebinarWithPresenter } from '@/lib/type';
import { findOneProduct } from '@/actions/product';

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
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

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;

  const product = webinarData.priceId
    ? await findOneProduct(webinarData.priceId)
    : null;

  return (
    <div className="w-full h-screen ">
      <RenderWebinar
        error={error}
        user={checkUser.user || null}
        webinar={webinarData}
        apiKey={apiKey}
        product={product}
      />
    </div>
  );
};

export default page;
