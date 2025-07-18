'use client';

import { updateAssistant } from '@/actions/vapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAiAgentStore } from '@/store/useAiAgentStore';
import { Info, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ConfigField from './ConfigField';
import DropDownSelect from './DropDownSelect';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import Link from 'next/link';

const ModelConfiguration = () => {
  const { assistant } = useAiAgentStore();
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (assistant) {
      setFirstMessage(assistant?.firstMessage || '');
      setSystemPrompt(assistant?.model?.messages?.[0]?.content || '');
    }
  }, [assistant]);

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const res = await updateAssistant(
        assistant!.id,
        firstMessage,
        systemPrompt,
      );

      if (!res.success) {
        throw new Error(res.message);
      }
      router.refresh();
      toast.success('Assistant Update Successfully');
    } catch (error) {
      console.error('Error updating assistant', error);
      toast.error('Failed to update assistant');
    } finally {
      setLoading(false);
    }
  };

  if (!assistant) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full p-4 sm:p-6 md:p-8">
        <div className="themeBgLight rounded-xl p-4 md:p-6 w-full max-w-md">
          <p className="text-primary/80 text-sm md:text-base text-center">
            No Assistant Selected. Please Select an Assistant to Configure the
            Model Settings
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="themeBgLight rounded-xl p-4 sm:p-6 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 sm:mb-0">
          <span className="text-sm font-semibold mr-0 sm:mr-2">Model</span>
          <h3 className="text-xl sm:text-2xl font-semibold uppercase">
            {assistant?.name}
          </h3>
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <Button
              // onClick={handleUpdateAssistant}
              /*disabled={loading}*/
              className="w-full sm:w-auto cursor-pointer text-black/60 bg-gray-400 hover:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Assistant'
              )}
            </Button>
          </HoverCardTrigger>
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
        </HoverCard>
      </div>
      <p className="text-neutral-400 mb-6 text-sm sm:text-base">
        Configure the behaviour of the assistant
      </p>

      <div className="mb-3">
        <div className="flex items-center mb-2">
          <label className="font-medium text-sm sm:text-base">
            First Message
          </label>
          <Info className="h-4 w-4 text-neutral-500 ml-2" />
        </div>
        <Input
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          className="bg-primary/10 border-input text-sm sm:text-base"
        />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <label className="font-medium text-sm sm:text-base">
              System Prompt
            </label>
            <Info className="h-4 w-4 text-neutral-500 ml-2" />
          </div>
        </div>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[150px] sm:min-h-[200px] max-h-[350px] bg-primary/10 border-input font-mono text-xs sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <ConfigField label="Provider">
          <DropDownSelect value={assistant.model?.provider || ''} />
        </ConfigField>

        <ConfigField label="Model" showInfo={true}>
          <DropDownSelect value={assistant.model?.model || ''} />
        </ConfigField>
      </div>
    </div>
  );
};

export default ModelConfiguration;
