'use client';

import React from 'react';
import PurpleIcon from '../PurpleIcon';

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

        <div className="w-full flex flex-col gap-4 items-start justify-start">
          <div
            className="w-full overflow-x-auto flex flex-wrap [&::-webkit-scrollbar]:h-1.5 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
