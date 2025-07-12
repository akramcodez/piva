import { ReactNode } from 'react';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/ReusableComponents/LayoutComponents/Sidebar';
import Header from '@/components/ReusableComponents/LayoutComponents/Header';
import { getProductsByOwnerId } from '@/actions/product';
import { ClientProduct } from '@/lib/type';
import { getAllAssistants } from '@/actions/vapi';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const userExist = await onAuthenticateUser();
  try {
    if (!userExist?.user) {
      redirect('/sign-in');
    }
  } catch (error) {
    redirect('/sign-in');
  }

  const stripeProductsRaw = await getProductsByOwnerId(userExist.user.id);

  const stripeProducts: ClientProduct[] = stripeProductsRaw.map((product) => ({
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  const assistants = await getAllAssistants();

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto scroll-auto px-3 sm:px-3 md:px-6 lg:px-10 xl:px-16 2xl:px-20">
        <Header
          user={userExist.user}
          stripeProducts={stripeProducts || []}
          assistants={assistants.data || []}
        />
        <div className="flex-1 py-3 md:py-6 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
