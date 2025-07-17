import Link from 'next/link';

type Props = {
  title: string;
  icon: any;
  link: string;
  children: React.ReactNode;
};

export const CompactDashboardCard = ({
  title,
  icon,
  children,
  link,
}: Props) => {
  return (
    <Link href={`/${link}`}>
      <div className="p-3 border rounded-lg bg-background shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-md font-semibold text-primary">{title}</h3>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          {children}
        </div>
      </div>
    </Link>
  );
};
