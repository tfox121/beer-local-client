import { useMutation, useQuery } from '@tanstack/react-query';
import { getPrivateRoute, publicRoute } from '../utils/api';

export const producerProfileQueryKey = (businessId) => [
  'producerProfile',
  businessId,
];

export const fetchProducerProfile = async (businessId) => {
  const response = await publicRoute.get(`/producer/${businessId}`);

  if (!response.data) {
    return null;
  }

  return {
    ...response.data.business,
    ...response.data.user,
  };
};

export const useProducerProfileQuery = (businessId, options = {}) =>
  useQuery({
    queryKey: producerProfileQueryKey(businessId),
    queryFn: () => fetchProducerProfile(businessId),
    enabled: Boolean(businessId),
    ...options,
  });

export const updateProfile = async (updateObj) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch('/producer/profile', updateObj);
  return response.data;
};

export const useUpdateProfileMutation = (options = {}) =>
  useMutation({
    mutationFn: updateProfile,
    ...options,
  });

export const updateProfileOptions = async (updateObj) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch(
    '/producer/profile/options',
    updateObj,
  );
  return response.data;
};

export const useUpdateProfileOptionsMutation = (options = {}) =>
  useMutation({
    mutationFn: updateProfileOptions,
    ...options,
  });

export const sendOrder = async (orderInfo) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post('/orders', orderInfo);
  return response.data;
};

export const useSendOrderMutation = (options = {}) =>
  useMutation({
    mutationFn: sendOrder,
    ...options,
  });

export const postBlog = async (blogPostData) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post('/producer/blog', blogPostData);
  return response.data;
};

export const usePostBlogMutation = (options = {}) =>
  useMutation({
    mutationFn: postBlog,
    ...options,
  });

export const editBlog = async (blogEditData) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch('/producer/blog', blogEditData);
  return response.data;
};

export const useEditBlogMutation = (options = {}) =>
  useMutation({
    mutationFn: editBlog,
    ...options,
  });

export const updateStock = async (stockEditData) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch('/producer/stock', stockEditData);
  return response.data;
};

export const useUpdateStockMutation = (options = {}) =>
  useMutation({
    mutationFn: updateStock,
    ...options,
  });

export const addPromotion = async (promotionAddData) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post(
    '/producer/promotion',
    promotionAddData,
  );
  return response.data;
};

export const useAddPromotionMutation = (options = {}) =>
  useMutation({
    mutationFn: addPromotion,
    ...options,
  });

export const deletePromotion = async (promotionId) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.delete(
    `/producer/promotion/${promotionId}`,
  );
  return response.data;
};

export const useDeletePromotionMutation = (options = {}) =>
  useMutation({
    mutationFn: deletePromotion,
    ...options,
  });
