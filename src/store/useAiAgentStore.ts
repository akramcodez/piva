import { Assistant } from '@vapi-ai/server-sdk/api';
import { create } from 'zustand';

export interface ExtendedAssistant extends Assistant {
  name: string;
  id: string;
  firstMessage?: string;
  model?: {
    provider: string;
    model: string;
    messages?: Array<{
      role: string;
      content: string;
    }>;
  };
}

type AiAgentStore = {
  assistant: ExtendedAssistant | null;
  setAssistant: (assistant: ExtendedAssistant) => void;
  clearAiAssistant: () => void;
};

export const useAiAgentStore = create<AiAgentStore>((set) => ({
  assistant: null,
  setAssistant: (assistant) => set({ assistant }),
  clearAiAssistant: () => set({ assistant: null }),
}));
