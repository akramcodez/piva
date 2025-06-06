import PageHeader from '@/components/ReusableComponents/PageHeader';
import { AttendedTypeEnum } from '@prisma/client';
import { HomeIcon, Layers, WebcamIcon } from 'lucide-react';
import React from 'react';
import { getWebinarAttendence } from '@/actions/attendence';
import PipelineLayout from './_components/PipelineLayout';
import { formatColumnTitle } from './_components/utils';

type Props = {
  params: { webinarId: string };
};

const Page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendence(webinarId);

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
        leftIcon={<HomeIcon className="w-3 h-3" />}
        mainIcon={<Layers className="w-12 h-12" />}
        rightIcon={<WebcamIcon className="w-4 h-4" />}
        heading="Webinar Pipeline"
        placeholder="Search Name, Tag or Email"
      >
        <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6">
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
