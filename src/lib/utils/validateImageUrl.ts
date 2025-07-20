const ALLOWED_DOMAINS = [
  'i.pinimg.com',
  'unsplash.com',
  'images.unsplash.com',
  'imgur.com',
  'lh3.googleusercontent.com',
  'i.imgur.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'res.cloudinary.com',
  'pbs.twimg.com',
  'media.licdn.com',
  'firebasestorage.googleapis.com',
  'cdn.shopify.com',
  'images.ctfassets.net',
  'raw.githubusercontent.com',
];

export function validateImageUrl(url: string): {
  isValid: boolean;
  message: string;
} {
  if (!url) {
    return { isValid: true, message: '' };
  }

  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    if (!ALLOWED_DOMAINS.includes(domain)) {
      return {
        isValid: false,
        message: `Invalid image domain`,
      };
    }

    return { isValid: true, message: '' };
  } catch (error: unknown) {
    console.error('Error validating image URL:', error);
    return { isValid: false, message: 'Invalid URL format' };
  }
}
