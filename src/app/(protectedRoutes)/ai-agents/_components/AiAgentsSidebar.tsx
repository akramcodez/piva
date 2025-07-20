'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiAgentStore } from '@/store/useAiAgentStore';
import { Assistant } from '@vapi-ai/server-sdk/api';
import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import CreateAssistantModel from './CreateAssistantModel';
import { User } from '@prisma/client';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  aiAgents: Assistant[] | [];
  user: User | null;
};

const AiAgentsSidebar = ({ aiAgents, user }: Props) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const { setAssistant, assistant } = useAiAgentStore(); // Add assistant from store

  // const handleCreateAssistantClick = () => {
  //   if (user?.stripeConnectId) {
  //     setIsModelOpen(true);
  //   } else {
  //     toast.warning(
  //       'Please connect your Stripe account in settings to create Assistants',
  //     );
  //     router.push('/settings');
  //   }
  // };

  return (
    <div className="md:w-[300px] border-b  md:border-r border-border flex flex-col">
      <div className="p-4">
        <HoverCard>
          <HoverCardTrigger>
            <Button
              className={`w-full flex items-center gap-2 mb-4 text-white/40 cursor-pointer ${
                user?.stripeConnectId
                  ? 'themeBgLight'
                  : 'bg-card hover:bg-muted border border-border'
              }`}
              // onClick={handleCreateAssistantClick}
            >
              <Plus /> Create Assistant
            </Button>
            <HoverCardContent className="glassBackground border-[2px] border-border px-2 py-1 [word-spacing:0.1em]">
              Feature unavailable, Connect with{' '}
              <Link
                className="themeColor underline"
                href="https://x.com/akramcodez"
                target="_blank"
              >
                Akram
              </Link>{' '}
              for more details
            </HoverCardContent>
          </HoverCardTrigger>
        </HoverCard>
        <div className="relative">
          <Input
            placeholder="Search Ai Agent"
            className="bg-neutral-900 border-neutral-700 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>
      <ScrollArea className="mt-4 overflow-auto">
        {aiAgents.map((aiAgent) => {
          const extendedAgent = {
            ...aiAgent,
            id: aiAgent.assistantId,
          };

          return (
            <div
              key={aiAgent.name}
              className={cn(
                'p-4 hoverthemeBg cursor-pointer',
                aiAgent.name === assistant?.name && 'themeBg',
              )}
              onClick={() => setAssistant(extendedAgent)}
            >
              <div className="font-medium">{aiAgent.name}</div>
            </div>
          );
        })}
      </ScrollArea>

      <CreateAssistantModel
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
      />
    </div>
  );
};

export default AiAgentsSidebar;
