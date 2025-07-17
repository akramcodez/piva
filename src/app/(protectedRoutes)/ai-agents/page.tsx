import { getAllAssistants } from '@/actions/vapi';
import React from 'react';
import AiAgentsSidebar from './_components/AiAgentsSidebar';
import ModelSelection from './_components/ModelSelection';
import { onAuthenticateUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const allAgents = await getAllAssistants();
  const userExist = await onAuthenticateUser();

  if (!userExist?.user) {
    redirect('/sign-in');
  }

  return (
    <div className="w-full flex flex-col md:flex-row h-auto md:h-[80vh] text-primary border border-border">
      <AiAgentsSidebar aiAgents={allAgents?.data || []} user={userExist.user} />
      <div className="flex-1 flex flex-col">
        <ModelSelection />
      </div>
    </div>
  );
};

export default page;
