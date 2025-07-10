import { getAllAssistants } from '@/actions/vapi';
import React from 'react';
import AiAgentsSidebar from './_components/AiAgentsSidebar';
import ModelSelection from './_components/ModelSelection';

const page = async () => {
  const allAgents = await getAllAssistants();

  return (
    <div className="w-full flex h-[80vh] text-primary border border-border rounded-se-xl">
      <AiAgentsSidebar aiAgents={allAgents?.data || []} />
      <div className="flex-1 flex flex-col">
        <ModelSelection />
      </div>
    </div>
  );
};

export default page;
