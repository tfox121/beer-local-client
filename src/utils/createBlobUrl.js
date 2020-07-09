const urls = new WeakMap();

const createBlobUrl = (blob) => {
  if (urls.has(blob)) {
    return urls.get(blob);
  }
  const url = URL.createObjectURL(blob);
  urls.set(blob, url);
  return url;
};

export default createBlobUrl;
