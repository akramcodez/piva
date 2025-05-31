'use client';
import { CircleCheckBig } from 'lucide-react';
import { onBoardingSteps } from '@/lib/data';
import Link from 'next/link';

const OnBoarding = () => {
  return (
    <div className="flex flex-col gap-1.5 items-start justify-start">
      {onBoardingSteps.map((step, index) => (
        <Link
          key={index}
          href={step.link}
          className="flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
        >
          <CircleCheckBig className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>{step.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default OnBoarding;
