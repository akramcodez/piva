import { ReactNode } from 'react';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/ReusableComponents/LayoutComponents/Sidebar';
import Header from '@/components/ReusableComponents/LayoutComponents/Header';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const userExist = await onAuthenticateUser();

  if (!userExist || !userExist.user) {
    redirect('/sign-in');
  }

  console.log(userExist.user);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto scroll-auto container px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-20 mx-auto">
        <Header user={userExist.user!} />
        {children}
      </div>
    </div>
  );
}
