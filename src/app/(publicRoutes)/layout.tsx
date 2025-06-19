import React from 'react';

type Props = {
  children?: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
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
    </>
  );
};

export default layout;
