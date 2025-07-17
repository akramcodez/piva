'use client';

import { usePathname } from 'next/navigation';
import { Triangle } from 'lucide-react';
import React, { useState } from 'react';
import { sidebarData } from '@/lib/data';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';
import {
  TooltipContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const UserButtonWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <UserButton afterSignOutUrl="/" />;
};

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-15 sm:w-18 h-screen sticky top-0 py-10 px-2 sm:px-6 border bg-background border-border flex flex-col items-center justify-start gap-10">
      <div>
        <Link href="/home">
          <Triangle className="themeColor" strokeWidth={2.5} size={'27px'} />
        </Link>
      </div>
      <div className="w-full h-full justify-between items-center flex flex-col gap-4">
        <div className="w-full h-fit flex flex-col gap-4 items-center justify-center">
          {sidebarData.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.link}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg p-2 ${
                      pathname.includes(item.link) ? 'iconBackground' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-5 2xl:h-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="iconBackground font-semibold text-white opacity-80"
                >
                  <span className="text-xs">{item.title}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <UserButtonWrapper />
      </div>
    </div>
  );
};

export default Sidebar;
