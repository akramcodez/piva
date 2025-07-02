import { Upload, Webcam } from 'lucide-react';
import OnBoarding from './_components/OnBoarding';
import FeatureCard from './_components/FeatureCard';
import FeatureSectionLayout from './_components/FeatureSectionLayout';
import Image from 'next/image';
import { potentialCustomer } from '@/lib/data';
import UserInfoCard from '@/components/ReusableComponents/UserInfoCard/index';

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="w-full mx-auto h-full px-2 sm:px-4">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-10">
        <div className="space-y-3 sm:space-y-5">
          <h2 className="text-primary font-medium text-xl sm:text-2xl r">
            Get maximum conversion from your webinars
          </h2>
          <OnBoarding />
        </div>
        <div className="flex gap-3 sm:gap-5 w-full justify-evenly items-center">
          <FeatureCard
            Icon={<Upload className="w-5 h-5 sm:w-10 sm:h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            smHeading="Export"
            link="/export"
          />
          <FeatureCard
            Icon={<Webcam className="w-5 h-5 sm:w-10 sm:h-10" />}
            heading="Browse or drag a pre-recorded webinar file"
            smHeading="Webinar"
            link="/webinars"
          />
        </div>
      </div>

      <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl bg-background-10">
        <FeatureSectionLayout
          heading="See how far along are your potential customers"
          link="/lead"
        >
          <div className="p-5 flex flex-col gap-4 items-start border rounded-xl border-border backdrop-blur-3xl bg-[#0d0d0d]">
            <div className="w-full flex justify-between items-center gap-3">
              <p className="text-primary font-semibold text-sm">Conversions</p>
              <p className="text-xs text-muted-foreground font-normal">
                Conversions
              </p>
            </div>
            <div className="flex flex-col gap-4 items-start">
              {Array.from({ length: 3 }).map((_, index) => (
                <Image
                  src="/featurecard.png"
                  alt="Info-card"
                  width={250}
                  height={250}
                  className="w-full h-full object-cover rounded-xl"
                  key={index}
                />
              ))}
            </div>
          </div>
        </FeatureSectionLayout>

        <FeatureSectionLayout
          heading="See the list of your current customers"
          link="/pipeline"
        >
          <div
            className="flex gap-4 items-center h-full w-full justify-center
            relative flex-wrap"
          >
            {potentialCustomer.slice(0, 2).map((customer, index) => (
              <UserInfoCard
                customer={customer}
                tags={customer.tags}
                key={index}
              />
            ))}
            <Image
              src={'/glowCard.png'}
              alt="Info-card"
              width={350}
              height={350}
              className="object-cover rounded-xl absolute px-5 mb-20 hidden sm:flex md:flex"
            />
          </div>
        </FeatureSectionLayout>
      </div>
    </div>
  );
};

export default Page;
