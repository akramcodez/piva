'use client';

import React from 'react';
import PurpleIcon from '../PurpleIcon';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Props = {
  heading?: string;
  mainIcon: React.ReactNode;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  children: React.ReactNode;
  placeholder: string;
};

const PageHeader = ({
  heading,
  mainIcon,
  leftIcon,
  rightIcon,
  children,
  placeholder,
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <div
        className="w-full flex justify-center
        sm:justify-between items-center gap-8 flex-wrap"
      >
        <p className="text-primary text-4xl font-semibold">{heading}</p>

        <div className="relative md:mr-28">
          <PurpleIcon className="absolute -left-4 -top-3 -z-10 -rotate-45 py-3">
            {leftIcon}
          </PurpleIcon>
          <PurpleIcon className="z-10 backdrop-blur">{mainIcon}</PurpleIcon>
          <PurpleIcon className="absolute -right-4 -z-10 py-3 rotate-45 -top-3">
            {rightIcon}
          </PurpleIcon>
        </div>

        <div className="w-full flex flex-wrap gap-6 items-center justify-between">
          <div className="w-full md:flex-1 flex items-center gap-2 border rounded-md p-1 shadow-sm">
            <Search className="h-7 w-7 text-gray-500 pl-2" />
            <Input
              type="text"
              placeholder={placeholder || 'Search...'}
              className="flex-1 border-none outline-none"
            />
          </div>
          <div className="w-full md:max-w-[25%] overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
