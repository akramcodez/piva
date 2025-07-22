import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Piva (Public Routes)',
  description:
    'Join live AI-enhanced webinars with interactive chat and automated sales. Experience intelligent customer engagement',
  authors: [{ name: 'SK Akram', url: 'https://x.com/akramcodez' }],
};

type Props = {
  children?: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
      <ErrorBoundary>
        <video
          autoPlay
          muted
          loop
          className="fixed z-[-1] w-full h-full object-cover opacity-12"
        >
          <source src="/webinarBackgroundVideo.mp4" type="video/mp4" />
        </video>
        <div className="w-full container mx-auto min-h-screen">
          <main>{children}</main>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default layout;
