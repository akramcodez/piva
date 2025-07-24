// src/components/ReusableComponents/LayoutComponents/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { sidebarData } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#2dd4bf',
          colorText: '#ffffff',
          borderRadius: '0.5rem',
        },
        elements: {
          userButtonTrigger: {
            border: '1px solid #374151',
            '&:hover': {
              borderColor: '#2dd4bf',
            },
          },
        },
      }}
    />
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-15 sm:w-18 h-screen sticky top-0 py-10 px-2 sm:px-6 border bg-background border-border flex flex-col items-center justify-start gap-10">
      <div>
        <Link href="/home">
          <Image src={'/logo.png'} alt="Piva Logo" width={30} height={30} />
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
                    target={
                      item.link === 'https://github.com/akramcodez/Piva'
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      item.link === 'https://github.com/akramcodez/Piva'
                        ? 'noopener noreferrer'
                        : undefined
                    }
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
