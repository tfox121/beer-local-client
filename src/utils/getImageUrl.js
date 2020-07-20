const getImageUrl = (sub, type, productId) => type === 'product'
  ? `${process.env.REACT_APP_CLOUDFRONT_URL}${sub}/${type}/${productId}.png`
  : `${process.env.REACT_APP_CLOUDFRONT_URL}${sub}/${type}.png`;

export default getImageUrl;
