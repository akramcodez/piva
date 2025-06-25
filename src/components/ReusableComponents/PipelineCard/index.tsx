import { cn } from '@/lib/utils';
import { AttendanceUser } from '@/lib/type';
import React from 'react';

type Props = {
  customer: AttendanceUser;
  tags: string[];
  className?: string;
};

const PipelineCard = ({ customer, tags, className }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col w-full text-primary p-3 pr-10 gap-3 rounded-xl border-[0.5px] border-border backdrop-blur-[20px] bg-[#141313]',
        className,
      )}
    >
      <h3 className="font-semibold text-xs">Name: {customer.name}</h3>
      <p className="text-xs">Email: {customer.email}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs lg:text-sm text-foreground px-3 py-1 rounded-mg bg-[#100f0f] border rounded-sm border-border"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <span className="text-xs text-foreground/60 ">
          created at {customer.attendedAt.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PipelineCard;
