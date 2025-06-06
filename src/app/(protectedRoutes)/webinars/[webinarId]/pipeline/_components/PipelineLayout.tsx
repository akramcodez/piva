import React from 'react';
import { AttendanceUser } from '@/lib/type';

type PipelineLayoutProps = {
  title: string;
  count: number;
  users: AttendanceUser[];
  tags: string[];
};

const PipelineLayout = ({ title, count, users, tags }: PipelineLayoutProps) => {
  return <div>demo</div>;
};

export default PipelineLayout;
