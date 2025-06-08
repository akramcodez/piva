import React from 'react';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { UserRound, WebcamIcon, Layers } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { leadData } from './__tests__/data';

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<WebcamIcon className="w-3 h-3" />}
        mainIcon={<UserRound className="w-12 h-12" />}
        rightIcon={<Layers className="w-4 h-4" />}
        heading="ALL Your Leads"
        placeholder="Search Customers..."
      >
        <></>
      </PageHeader>
      <Table suppressHydrationWarning>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm text-muted-forground">Name</TableHead>
            <TableHead className="text-sm text-muted-forground">
              Email
            </TableHead>
            <TableHead className="text-sm text-muted-forground">
              Phone
            </TableHead>
            <TableHead className="text-center text-sm text-muted-forground">
              Tags
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leadData?.map((lead, idx) => (
            <TableRow key={idx} className="border-0" suppressHydrationWarning>
              <TableCell className="font-medium" suppressHydrationWarning>
                {lead?.name}
              </TableCell>
              <TableCell suppressHydrationWarning>{lead?.email}</TableCell>
              <TableCell suppressHydrationWarning>{lead?.phone}</TableCell>
              <TableCell className="text-right" suppressHydrationWarning>
                {lead?.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" suppressHydrationWarning>
                    {tag}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
