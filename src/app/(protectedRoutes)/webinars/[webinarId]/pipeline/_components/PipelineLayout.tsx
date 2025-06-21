import React from 'react';
import { AttendanceUser } from '@/lib/type';
import { Badge } from '@/components/ui/badge';
import UserInfoCard2 from '@/components/ReusableComponents/UserInfoCard2/index';

type PipelineLayoutProps = {
  title: string;
  count: number;
  users: AttendanceUser[];
  tags: string[];
};

const PipelineLayout = ({ title, count, users, tags }: PipelineLayoutProps) => {
  return (
    <div
      className="flex-shrink-0 w-[200px] lg:w-[350px] p-2 lg:p-3 border border-border bg-background/10 
      rounded-xl backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between backdrop-blur-2xl pb-3">
        <h2 className="font-medium">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>

      <div
        className="space-y-3 max-h-[70vh] overflow-y-auto pr-2
      scrollbar-hidden"
      >
        {users.map((user, index) => (
          <UserInfoCard2 key={index} customer={user} tags={tags} />
        ))}
      </div>
    </div>
  );
};

export default PipelineLayout;

// TODO: improve design
