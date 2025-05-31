import React from 'react';
import Link from 'next/link';

type Props = {
  Icon: React.ReactNode;
  heading: string;
  link: string;
};

const FeatureCard = ({ Icon, heading, link }: Props) => {
  return (
    <Link
      href={link}
      className="px-8 py-6 flex flex-col items-center gap-14 rounded-xl border border-border bg-secondary backdrop-blur-xl"
    >
      {Icon}
      <p className="font-semibold text-xl text-primary"></p>
    </Link>
  );
};

export default FeatureCard;
