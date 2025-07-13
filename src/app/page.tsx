import { onAuthenticateUser } from '@/actions/auth';
import Background from '@/components/ReusableComponents/Background';
import Features from '@/components/ReusableComponents/LandingPageComponents/Features';
import LandingHome from '@/components/ReusableComponents/LandingPageComponents/LandingHome';
import Navbar from '@/components/ReusableComponents/LandingPageComponents/Navbar';
import Support from '@/components/ReusableComponents/LandingPageComponents/About';
import Workflow from '@/components/ReusableComponents/LandingPageComponents/Workflow';
import About from '@/components/ReusableComponents/LandingPageComponents/About';
import Footer from '@/components/ReusableComponents/LandingPageComponents/Footer';

export default async function Home() {
  const userExist = await onAuthenticateUser();

  return (
    <div className="flex w-full min-h-screen flex-col font[family-name:var(--font-geist-sans)]">
      <Background />
      <Navbar user={userExist.user} />
      <main className="flex-1">
        <section
          id="home"
          className="flex items-center justify-center min-h-screen "
        >
          <LandingHome user={userExist.user} />
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
          <Workflow user={userExist.user} />
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
