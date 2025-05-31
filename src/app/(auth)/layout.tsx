import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
}
