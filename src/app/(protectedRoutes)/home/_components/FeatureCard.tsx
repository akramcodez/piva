import React from 'react';
import Link from 'next/link';

type Props = {
  Icon: React.ReactNode;
  heading: string;
  smHeading: string;
  link: string;
};

const FeatureCard = ({ Icon, heading, smHeading, link }: Props) => {
  return (
    <Link
      href={link}
      className="px-4 py-3 sm:px-5 sm:py-4 flex flex-row sm:flex-col items-start gap-3 lg:gap-6 rounded-xl border border-border glassBackground backdrop-blur-xl opacity-80 hover:opacity-100 hoverthemeBgLight"
    >
      {Icon}
      <p className="hidden md:block font-semibold text-xs lg:text-xl text-primary">
        {heading}
      </p>
      <p className="block md:hidden font-semibold text-sm lg:text-xl text-primary">
        {smHeading}
      </p>
    </Link>
  );
};

export default FeatureCard;
