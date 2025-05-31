import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode; // Corrected from 'clildren'
};

const PurpleIcon = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        'px-3 py-2 sm:px-4 sm:py-3 md:px-3 md:py-2 lg:px-3 lg:py-2 iconBackground',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PurpleIcon;
