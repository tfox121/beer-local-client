const getImageUrl = (sub, type, productId) => {
  const cloudfrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

  if (!cloudfrontUrl) {
    console.error('REACT_APP_CLOUDFRONT_URL environment variable is not set');
    throw new Error(
      'REACT_APP_CLOUDFRONT_URL environment variable is required',
    );
  }

  if (!sub) {
    console.error('User sub is required for getImageUrl');
    throw new Error('User sub is required for getImageUrl');
  }

  // Ensure cloudfrontUrl ends with / and sub doesn't start with /
  const baseUrl = cloudfrontUrl.endsWith('/')
    ? cloudfrontUrl
    : `${cloudfrontUrl}/`;
  const userSub = sub.startsWith('/') ? sub.slice(1) : sub;

  return type === 'product'
    ? `${baseUrl}${userSub}/${type}/${productId}.png`
    : `${baseUrl}${userSub}/${type}.png`;
};

export default getImageUrl;
