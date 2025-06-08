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

  if (!userExist.user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto scroll-auto px-3 sm:px-3 md:px-6 lg:px-10 xl:px-16 2xl:px-20">
        <Header user={userExist.user} />
        <div className="flex-1 py-3 md:py-6 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
