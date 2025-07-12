'use client';
import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f3d_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f3d_1px,transparent_1px)] bg-[size:16px_28px] animate-pulse"></div>

      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/80"></div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-500/20 to-transparent animate-wave"></div>
    </div>
  );
};

export default Background;
