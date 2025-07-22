'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { navbarOptions } from '@/lib/data';
import { CgMenuLeftAlt } from 'react-icons/cg';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { User } from '@prisma/client';
import Image from 'next/image';

type Props = {
  user?: User | null;
};

const Navbar = ({ user }: Props) => {
  return (
    <div className="flex items-center justify-between w-full h-[60px] sm:h-[70px] border-b-[1px] border-b-gray-700 glassBackground sticky top-0 z-20 overflow-hidden px-6 sm:px-6 md:px-6 lg:px-[90px] xl:px-[100px] 2xl:px-[120px] ">
      <Link href="/" className="flex gap-2 items-center">
        <Image src={'/logo.png'} alt="Piva Logo" width={28} height={28} />
        <span className="text-xl text-gray-200 font-semibold ubuntu-medium">
          Piva
        </span>
      </Link>
      <div className="sm:flex hidden items-center gap-8">
        {navbarOptions.map((option) => (
          <Link
            key={option.id}
            href={`#${option.title.toLowerCase()}`}
            className="text-md text-white font-semibold hoverthemeColor"
          >
            {option.title}
          </Link>
        ))}
      </div>
      {!user && (
        <Link href="/sign-in">
          <Button className="sm:flex items-center hidden animated-gradient-bg text-white border-[0.1rem] border-[#2c8c88]">
            Let&apos;s Start
          </Button>
        </Link>
      )}
      {user && (
        <Link href="/home">
          <Button className="sm:flex items-center hidden animated-gradient-bg text-white border-[0.1rem] border-[#2c8c88] cursor-pointer">
            Dashboard
          </Button>
        </Link>
      )}
      <div className="sm:hidden flex">
        <HoverCard>
          <HoverCardTrigger>
            <Button className="sm:hidden flex items-center bg-transparent text-white hoverthemeBgLight border-[0.1rem] border-[#2c8c88] cursor-pointer">
              <CgMenuLeftAlt strokeWidth={1.5} />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="glassBackground flex flex-col w-[320px] border-[2px] border-gray-700 gap-4 mr-2 mt-1">
            <div className="flex items-center justify-evenly gap-4">
              {navbarOptions.map((option) => (
                <Link
                  key={option.id}
                  href={option.link}
                  className="text-sm text-white font-semibold hoverthemeColor"
                >
                  {option.title}
                </Link>
              ))}
            </div>
            {!user && (
              <Link className="text-sm cursor-pointer" href="/sign-in">
                <Button className="mx-auto flex items-center w-[70%] h-[35px] text-white border animated-gradient-bg border-[#2c8c88]">
                  Let&apos;s Start
                </Button>
              </Link>
            )}
            {user && (
              <Link className="text-sm cursor-pointer" href="/home">
                <Button className="mx-auto flex items-center w-[70%] h-[35px] text-white border animated-gradient-bg border-[#2c8c88]">
                  Dashboard
                </Button>
              </Link>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default Navbar;
