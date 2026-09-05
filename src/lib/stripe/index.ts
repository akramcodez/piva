import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: 'pivaAi Saas',
    version: '1.0.0',
  },
});
