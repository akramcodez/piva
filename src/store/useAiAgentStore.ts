import { create } from 'zustand';
import { AppAssistant } from '@/lib/type';

type AiAgentStore = {
  assistant: AppAssistant | null;
  setAssistant: (assistant: AppAssistant) => void;
  clearAiAssistant: () => void;
};

export const useAiAgentStore = create<AiAgentStore>((set) => ({
  assistant: null,
  setAssistant: (assistant) => set({ assistant }),
  clearAiAssistant: () => set({ assistant: null }),
}));
