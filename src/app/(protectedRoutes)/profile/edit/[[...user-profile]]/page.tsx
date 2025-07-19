import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import React from 'react';

const UserProfilePage = () => {
  return (
    <>
      <div className="hidden xl:flex min-h-[80vh] items-start justify-center">
        <UserProfile
          path="/profile/edit"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#2dd4bf',
              colorText: '#ffffff',
              borderRadius: '0.5rem',
            },
            elements: {
              card: {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: '1px solid #374151',
                width: '100%',
                maxWidth: '42rem',
              },
              headerTitle: {
                fontSize: '1.5rem',
              },
              formButtonPrimary: {
                '&:hover': {
                  backgroundColor: '#14b8a6',
                },
              },
            },
          }}
        />
      </div>
      <div className="flex xl:hidden h-full w-full justify-center items-center">
        <h3 className="text-xl font-semibold ">
          This feature is available only on larger screens
        </h3>
      </div>
    </>
  );
};

export default UserProfilePage;
