import { StreamClient } from '@stream-io/node-sdk';

export const getStreamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY || 'placeholder_api_key',
  process.env.STREAM_SECRET || 'placeholder_secret',
);
