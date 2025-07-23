import { onAuthenticateUser } from '@/actions/auth';
import { calculateRevenue, countProducts } from '@/actions/product';
import { countWebinars } from '@/actions/webinar';
import { RiRobot3Line } from 'react-icons/ri';
import { getStripeOAuthLink } from '@/lib/stripe/util';
import { LucideDollarSign, LucidePackage, LucideVideo } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { StripeConnectCard } from './_components/StripeConnectCard';
import { AccountSettingsCard } from './_components/AccountSettingsCard';
import { CompactDashboardCard } from './_components/CompactDashboardCard';
import { addStripeId } from '@/actions/stripe';

const page = async () => {
  const { user } = await onAuthenticateUser();

  if (!user) {
    redirect('/sign-in');
  }

  const isConnected = !!user.stripeConnectId;

  const [totalWebinars, totalProducts, revenueCount] = await Promise.all([
    countWebinars(user.id),
    countProducts(user.id),
    calculateRevenue(user.id),
  ]);

  return (
    <div className="md:px-3 space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your connections, content, and account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StripeConnectCard isConnected={isConnected} userId={user.id} />

        <AccountSettingsCard user={user} />

        <CompactDashboardCard
          title="Webinars"
          icon={<LucideVideo className="w-5 h-5 text-blue-600" />}
          link={'webinars'}
        >
          <StatDisplay label="Total" value={totalWebinars.count} />
          <StatDisplay
            label="Payments"
            value={isConnected ? 'Active' : 'Inactive'}
          />
        </CompactDashboardCard>

        <CompactDashboardCard
          title="Products"
          icon={<LucidePackage className="w-5 h-5 text-green-600" />}
          link={'products'}
        >
          <StatDisplay label="Total" value={totalProducts.count} />
          <StatDisplay label="Store" value={isConnected ? 'Live' : 'Pending'} />
        </CompactDashboardCard>

        <CompactDashboardCard
          title="Revenue"
          icon={<LucideDollarSign className="w-5 h-5 text-purple-600" />}
          link={'products'}
        >
          <StatDisplay label="Total" value={`${revenueCount.revenue}`} />
          <StatDisplay
            label="Gateway"
            value={isConnected ? 'Connected' : 'Missing'}
          />
        </CompactDashboardCard>

        <CompactDashboardCard
          title="AI Agents"
          icon={<RiRobot3Line className="w-5 h-5 text-orange-700" />}
          link={'ai-agents'}
        >
          <StatDisplay label="Total" value={`${3}`} />
          <StatDisplay
            label="Mode"
            value={isConnected ? 'Active' : 'Inactive'}
          />
        </CompactDashboardCard>
      </div>
    </div>
  );
};

export default page;

type Props2 = {
  label: string;
  value: string | number;
};

const StatDisplay = ({ label, value }: Props2) => (
  <div className="flex flex-col items-start">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-lg font-bold text-primary">{value}</p>
  </div>
);
