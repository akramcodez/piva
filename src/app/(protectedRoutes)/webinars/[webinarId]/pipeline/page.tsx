import PageHeader from '@/components/ReusableComponents/PageHeader';
import { AttendedTypeEnum } from '@prisma/client';
import { UserRound, Layers, WebcamIcon } from 'lucide-react';
import React from 'react';
import { getWebinarAttendence } from '@/actions/attendence';
import PipelineLayout from './_components/PipelineLayout';
import { formatColumnTitle } from './_components/utils';
import { demoData } from './_components/__test__/data';

type Props = {
  params: { webinarId: string };
};

const Page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendence(webinarId);

  // const pipelineData = demoData;
  // (Use only for test)

  if (!pipelineData.data) {
    return (
      <div className="text-3xl h-[400px] flex justify-center items-center">
        No Pipelines Found
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<UserRound className="w-3 h-3" />}
        mainIcon={<Layers className="w-12 h-12" />}
        rightIcon={<WebcamIcon className="w-4 h-4" />}
        heading="Webinar Pipeline"
        placeholder="Search Name, Tag or Email"
      >
        <div
          className="flex overflow-y-auto mt-3 pb-1 lg:pb-2 gap-3 md:gap-4 [&::-webkit-scrollbar]:h-1.5 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {Object.entries(pipelineData.data).map(([columnType, columnData]) => {
            const title = formatColumnTitle(columnType as AttendedTypeEnum);
            if (!title) return null;

            return (
              <PipelineLayout
                key={columnType}
                title={title}
                count={columnData.count}
                users={columnData.users}
                tags={pipelineData.tags}
              />
            );
          })}
        </div>
      </PageHeader>
    </div>
  );
};

export default Page;
