import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPrivateRoute } from '../utils/api';

export const orderQueryKey = orderId => ['order', orderId];
export const producerOrdersQueryKey = ['producer-orders'];

export const fetchProducerOrders = async () => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get('/orders');
  return response.data;
};

export const useProducerOrdersQuery = (options = {}) => useQuery({
  queryKey: producerOrdersQueryKey,
  queryFn: fetchProducerOrders,
  ...options,
});

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

export const useEditProducerOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchOrder,
    onSuccess: data => {
      if (data && data.order) {
        queryClient.setQueryData(producerOrdersQueryKey, previous => {
          if (!previous || !previous.orders) {
            return previous;
          }

          return {
            ...previous,
            orders: previous.orders.map(order => {
              if (order._id === data.order._id) {
                return data.order;
              }
              return order;
            }),
          };
        });

        queryClient.setQueryData(orderQueryKey(data.order._id), data);
        queryClient.invalidateQueries({ queryKey: orderQueryKey(data.order._id) });
      }

      queryClient.invalidateQueries({ queryKey: producerOrdersQueryKey });
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
