import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading Please Wait...
        </p>
      </div>
    </div>
  );
}
