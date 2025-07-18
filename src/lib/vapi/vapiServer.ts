import jwt from 'jsonwebtoken';
import { VapiClient } from '@vapi-ai/server-sdk';

// Create a function that returns a fresh client with a new token
export function getVapiClient() {
  const payload = {
    orgId: process.env.VAPI_ORG_ID,
    token: {
      tag: 'private',
    },
  };

  const key = process.env.VAPI_PRIVATE_KEY!;

  // Keep your 20-second expiry for testing
  const token = jwt.sign(payload, key, { expiresIn: 3600 });

  console.log('Generated new JWT token at:', new Date().toISOString());

  return new VapiClient({ token });
}
