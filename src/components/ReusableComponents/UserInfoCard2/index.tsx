import { cn } from '@/lib/utils';
import { AttendanceUser } from '@/lib/type';
import React from 'react';

type Props = {
  customer: AttendanceUser;
  tags: string[];
  className?: string;
};

const UserInfoCard = ({ customer, tags, className }: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col w-fit text-primary p-3 pr-10 gap-3 rounded-xl border-[0.5px] border-border backdrop-blur-[20px] bg-background/10',
        className,
      )}
    >
      <h3 className="font-semibold text-xs">{customer.name}</h3>
      <p className="text-xs">{customer.email}</p>
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-foreground px-3 py-1 rounded-mg norder border-border"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserInfoCard;
