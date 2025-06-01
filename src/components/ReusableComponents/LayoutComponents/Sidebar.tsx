'use client';

import { usePathname } from 'next/navigation';
import { Triangle } from 'lucide-react';
import React from 'react';
import { sidebarData } from '@/lib/data';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';
import {
  TooltipContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();
  return (
    <div className="w-18 sm:w-18 h-screen sticky top-0 py-10 px-2 sm:px-6 border bg-background border-border flex flex-col items-center justify-start gap-10">
      <div>
        <Link href="/home">
          <Triangle />
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
                    <item.icon className="w-6 h-6 sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-4 lg:h-4" />
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
        <UserButton />
      </div>
    </div>
  );
};

export default Sidebar;
