import { Upload, Webcam } from 'lucide-react';
import OnBoarding from './_components/OnBoarding';
import FeatureCard from './_components/FeatureCard';

type Props = {};

const Pages = (props: Props) => {
  return (
    <div className="w-full mx-auto h-full px-2 sm:px-4">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-10">
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-primary font-medium text-2xl sm:text-3xl">
            Get maximum conversion from your webinars
          </h2>
          <OnBoarding />
        </div>
        <div className="grid grid-col-1 sm:grid-cols-2 gap-6 place-content-center">
          <FeatureCard
            Icon={<Upload className="w-6 h-6" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="#"
          />
          <FeatureCard
            Icon={<Webcam className="w-6 h-6" />}
            heading="Browse or drag a pre-recorded webinar file"
            link="/webinars"
          />
        </div>
      </div>
    </div>
  );
};

export default Pages;
