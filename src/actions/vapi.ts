'use server';

import { vapiServer } from '@/lib/vapi/vapiServer';

export const getAllAssistants = async () => {
  try {
    const getAllAssistants = await vapiServer.assistants.list();
    return {
      success: true,
      status: 200,
      data: getAllAssistants,
    };
  } catch (error) {
    console.error('Error fetching agents:', error);
    return {
      success: false,
      status: 500,
      message: 'Failed to fetch agents',
    };
  }
};
