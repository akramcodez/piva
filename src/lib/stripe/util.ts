export const getStripeOAuthLink = (url: string, data: string) => {
  const clientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId) {
    throw new Error('Stripe Client ID is not configured');
  }

  if (!baseUrl) {
    throw new Error('Base URL is not configured');
  }

  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${baseUrl}/${url}&state=${data}`;
};
