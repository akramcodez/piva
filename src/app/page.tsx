'use client';

import { onAuthenticateUser } from '@/actions/auth';
import Background from '@/components/ReusableComponents/Background';
import Features from '@/components/ReusableComponents/LandingPageComponents/Features';
import LandingHome from '@/components/ReusableComponents/LandingPageComponents/LandingHome';
import Navbar from '@/components/ReusableComponents/LandingPageComponents/Navbar';
import Workflow from '@/components/ReusableComponents/LandingPageComponents/Workflow';
import About from '@/components/ReusableComponents/LandingPageComponents/About';
import Footer from '@/components/ReusableComponents/LandingPageComponents/Footer';
import { useEffect, useState } from 'react';
import { User } from '@prisma/client';

export default function Home() {
  const [userExist, setUserExist] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userExists = await onAuthenticateUser();
      setUserExist(userExists.user ?? null);
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full min-h-screen flex-col font[family-name:var(--font-geist-sans)]">
      <Background />
      <Navbar user={userExist} />
      <main className="flex-1">
        <section
          id="home"
          className="flex items-center justify-center min-h-screen "
        >
          <LandingHome user={userExist} />
        </section>
        <section
          id="features"
          className="flex items-center justify-center min-h-screen"
        >
          <Features />
        </section>
        <section
          id="workflow"
          className="flex items-center justify-center min-h-screen"
        >
          <Workflow user={userExist} />
        </section>
        <section
          id="about"
          className="flex items-center justify-center min-h-screen"
        >
          <About />
        </section>
      </main>
      <Footer />
    </div>
  );
}

//TODO: create limit in book a call webinar creation
//TODO: create readme.md files in each folder
//TODO: warning do users that this is stripe demo account
//TODO: create a universal error handling component and error page
