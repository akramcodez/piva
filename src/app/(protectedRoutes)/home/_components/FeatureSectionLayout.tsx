import Link from 'next/link';
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  children: React.ReactNode;
  heading: string;
  link: string;
  className?: string;
};

const FeatureSectionLayout = ({
  children,
  heading,
  link,
  className,
}: Props) => {
  return (
    <div
      className={`p-6 sm:p-10 flex items-center justify-between flex-col gap-5 lg:gap-8 border rounded-2xl border-border bg-background-10 ${className}`}
    >
      {children}
      <div className="w-full justify-between items-center flex flex-wrap gap-4 sm:gap-10">
        <h3 className="sm:w-[80%] font-semibold text-md lg:text-2xl text-primary">
          {heading}
        </h3>
        <Link
          href={link}
          className="text-primary font-semibold text-lg flex items-center justify-center rounded-md opacity-50 gap-1 hoverthemeColor"
        >
          View <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
};

export default FeatureSectionLayout;
