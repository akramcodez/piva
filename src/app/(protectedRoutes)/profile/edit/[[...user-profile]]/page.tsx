// app/profile/edit/[[...user-profile]]/page.tsx
import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import React from 'react';

const UserProfilePage = () => {
  return (
    // Use responsive padding: p-4 on small screens, growing to py-12 on larger screens
    <>
      <div className="hidden xl:flex min-h-[80vh] items-start justify-center">
        <UserProfile
          path="/profile/edit"
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#2dd4bf', // A teal primary color
              colorText: '#ffffff',
              borderRadius: '0.5rem',
            },
            elements: {
              card: {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                border: '1px solid #374151', // A dark gray border
                // Ensure the card takes full width on mobile but not too wide on desktop
                width: '100%',
                maxWidth: '42rem', // Corresponds to 672px
              },
              headerTitle: {
                fontSize: '1.5rem',
              },
              formButtonPrimary: {
                '&:hover': {
                  backgroundColor: '#14b8a6', // Darker teal on hover
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
