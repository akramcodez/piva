import PageHeader from '@/components/ReusableComponents/PageHeader';
import { AttendedTypeEnum } from '@prisma/client';
import { format } from 'date-fns';
import { HomeIcon, Layers, WebcamIcon } from 'lucide-react';
import React from 'react';

type Props = {
  params: { webinarId: string };
};

const Page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId);

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
          {Object.entries(pipelineData.data).map(([columnType, columnData]) => (
            <PipelineLayout
              key={columnType}
              tite={formatColumnTitle(columnType as AttendedTypeEnum)}
              count={columnData.count}
              users={columnData.users}
              tags={columnData.tags}
            />
          ))}
        </div>
      </PageHeader>
    </div>
  );
};

export default Page;
