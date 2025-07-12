import { onAuthenticateUser } from '@/actions/auth';
import Background from '@/components/ReusableComponents/Background';
import LandingHome from '@/components/ReusableComponents/LandingPageComponents/LandingHome';
import Navbar from '@/components/ReusableComponents/LandingPageComponents/Navbar';

export default async function Home() {
  const userExist = await onAuthenticateUser();
  console.log(userExist);
  return (
    <div className="flex w-full min-h-screen flex-col font[family-name:var(--font-geist-sans)]">
      <Background />
      <Navbar />
      <main className="flex-1">
        <section
          id="home"
          className="flex items-center justify-center min-h-screen "
        >
          <LandingHome />
        </section>
        <section
          id="features"
          className="flex items-center justify-center min-h-screen"
        >
          <h2 className="text-3xl font-bold text-white">Features</h2>
        </section>
        <section
          id="use"
          className="flex items-center justify-center min-h-screen"
        >
          <h2 className="text-3xl font-bold text-white ">Use Cases</h2>
        </section>
        <section
          id="support"
          className="flex items-center justify-center min-h-screen"
        >
          <h2 className="text-3xl font-bold text-white">Support</h2>
        </section>
      </main>
    </div>
  );
}
