import jwt from 'jsonwebtoken';
import { VapiClient } from '@vapi-ai/server-sdk';

export function getVapiClient() {
  const payload = {
    orgId: process.env.VAPI_ORG_ID,
    token: {
      tag: 'private',
    },
  };

  const key = process.env.VAPI_PRIVATE_KEY!;

  const token = jwt.sign(payload, key, { expiresIn: 3600 });

  console.log('Generated new JWT token at:', new Date().toISOString());

  return new VapiClient({ token });
}
