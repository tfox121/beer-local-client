import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPrivateRoute } from '../utils/api';

export const orderQueryKey = orderId => ['order', orderId];

export const fetchOrderById = async orderId => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get(`/orders/${orderId}`);
  return response.data;
};

export const useOrderQuery = (orderId, options = {}) => useQuery({
  queryKey: orderQueryKey(orderId),
  queryFn: () => fetchOrderById(orderId),
  enabled: !!orderId,
  ...options,
});

export const patchOrder = async editObj => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch(`/orders/${editObj._id}`, {
    ...editObj,
  });
  return response.data;
};

export const useEditOrderMutation = orderId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchOrder,
    onSuccess: data => {
      queryClient.setQueryData(orderQueryKey(orderId), data);
      queryClient.invalidateQueries({ queryKey: orderQueryKey(orderId) });
    },
  });
};

export const postOrderMessage = async messageContent => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post(`/orders/${messageContent._id}/message`, { content: messageContent.content });
  return response.data;
};

export const useSendOrderMessageMutation = orderId => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postOrderMessage,
    onSuccess: data => {
      queryClient.setQueryData(orderQueryKey(orderId), data);
      queryClient.invalidateQueries({ queryKey: orderQueryKey(orderId) });
    },
  });
};
