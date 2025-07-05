'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiAgentStore } from '@/store/useAiAgentStore';
import { Assistant } from '@vapi-ai/server-sdk/api';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import CreateAssistantModel from './CreateAssistantModel';

type Props = {
  aiAgents: Assistant[] | [];
};

const AiAgentsSidebar = ({ aiAgents }: Props) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const { assistant, setAssistant } = useAiAgentStore();

  return (
    <div className="w-[300px] border-r border-border flex flex-col">
      <div className="p-4">
        <Button
          className="w-full flex items-center gap-2 mb-4 themeBg text-white hoverthemeBg hover:cursor-pointer"
          onClick={() => setIsModelOpen(true)}
        >
          <Plus /> Create Assistant
        </Button>
        <div className="relative">
          <Input
            placeholder="Search Ai Agent"
            className="bg-neutral-900 border-neutral-700 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>
      <ScrollArea className="mt-4 overflow-auto">
        {aiAgents.map((aiAgent) => (
          <div
            className={`p-4 ${
              aiAgent.id === assistant?.id ? 'themeBg' : ''
            } hoverthemeBg cursor-pointer`}
            key={aiAgent.id}
            onClick={() => {
              setAssistant(aiAgent);
            }}
          >
            <div className="font-medium">{aiAgent.name}</div>
          </div>
        ))}
      </ScrollArea>

      <CreateAssistantModel
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
      />
    </div>
  );
};

export default AiAgentsSidebar;
