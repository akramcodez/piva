'use client';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { LuZap } from 'react-icons/lu';
import { RiRobot3Line } from 'react-icons/ri';

type Props = {};

const LandingHome = (props: Props) => {
  return (
    <div className="flex w-full min-h-screen border border-border">
      <div className="flex flex-col w-full h-screen overflow-auto scroll-auto pt-17 px-3 sm:px-3 md:px-6 lg:px-10 xl:px-16 2xl:px-20">
        <div className="flex-1 flex flex-col items-center">
          <div className="sm:mt-24 mt-20 themeBorderBig rounded-3xl themeBgLight px-3 py-2 flex items-center gap-2">
            <LuZap className="sm:text-md text-xs" />
            <span className="font-semibold sm:text-md text-xs">
              Revolutionizing Sales with AI
            </span>
          </div>
          <div className="flex flex-col items-center sm:mt-6 gap-1">
            <h3 className="font-semibold text-[60px] ubuntu-medium">PIVA</h3>
            <h3 className="font-semibold text-[18px] sm:text-3xl ubuntu-regular">
              <span className="themeColor font-bold">{'{ '}</span>AI-Powered
              Sales Webinar Platform
              <span className="themeColor font-bold">{' }'}</span>
            </h3>
            <p className="sm:text-sm text-xs mt-4 opacity-70 text-center max-w-2xl leading-relaxed">
              Leverage the power of AI to automate your sales webinars, engage
              your audience dynamically, and gain actionable insights to close
              more deals faster
            </p>
          </div>

          <div className="border-[2px] themeBorderBig sm:w-[450px] w-[350px] rounded-lg mt-6 flex items-center justify-center">
            <div className="w-full h-full themeBgLight overflow-hidden shadow-lg relative p-8">
              <div className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 rounded-full themeBorder text-sm flex items-center gap-1 z-10">
                <Mic className="h-4 w-4" />
              </div>
              <div className="h-full flex items-center justify-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full border-4
                  themeBorderBig animate-ping opacity-20"
                    style={{ margin: '-2px' }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border-4
                  themeBorderBig animate-ping opacity-10"
                    style={{ margin: '-5px', animationDelay: '0.5s' }}
                  />

                  <div className="flex justify-center items-center rounded-full overflow-hidden border-4 p-6 themeBorderBig">
                    <RiRobot3Line className="w-[40px] h-[40px]" />
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-2 themeBgDark
              text-white p-2 rounded-full"
                  >
                    <Mic className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/sign-in"
            className="flex items-center px-6 py-1 mt-8 border-[0.1rem] border-[#2c8c88] rounded-lg animated-gradient-bg cursor-pointer"
          >
            Start Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingHome;
