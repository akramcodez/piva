'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { onAuthenticateUser } from '@/actions/auth';
import Loading from './loading';

const AuthCallbackPage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const handleAuthentication = async () => {
        try {
          const auth = await onAuthenticateUser(); // Call your server action

          if (auth.status === 201 || auth.status === 200) {
            router.push('/home');
          } else {
            router.push('/');
          }
        } catch (error: unknown) {
          console.error('Error during authentication callback:', error);
          router.push('/');
        }
      };

      handleAuthentication();
    } else if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  return <Loading />;
};

export default AuthCallbackPage;
