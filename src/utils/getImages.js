import { publicRoute, getPrivateRoute } from './api';
import createBlobUrl from './createBlobUrl';

export const getBanner = async (businessId) => {
  const response = await publicRoute.get(`/producer/banner/${businessId}`, {
    responseType: 'blob',
    timeout: 30000,
  });
  if (response.data.type !== 'undefined') {
    return createBlobUrl(response.data);
  }
  return undefined;
};

export const getOwnBanner = async () => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get('/user/banner/', {
    responseType: 'blob',
    timeout: 30000,
  });
  if (response.data.type !== 'undefined') {
    return createBlobUrl(response.data);
  }
  return undefined;
};

export const getAvatar = async (businessId) => {
  const response = await publicRoute.get(`/producer/avatar/${businessId}`, {
    responseType: 'blob',
    timeout: 30000,
  });
  if (response.data.type !== 'undefined') {
    return createBlobUrl(response.data);
  }
  return undefined;
};

export const getOwnAvatar = async () => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get('/user/avatar/', {
    responseType: 'blob',
    timeout: 30000,
  });
  if (response.data.type !== 'undefined') {
    return createBlobUrl(response.data);
  }
  return undefined;
};
