import { useQuery } from '@tanstack/react-query';
import { merge, pick } from 'lodash';
import { getPrivateRoute } from '../utils/api';

export const producerDashboardQueryKey = ['producerDashboard'];

export const fetchProducerDashboard = async () => {
  const privateRoute = await getPrivateRoute();

  const [orderResponse, retailersResponse] = await Promise.all([
    privateRoute.get('/orders'),
    privateRoute.get('/producer/retailers'),
  ]);

  const mergedOrders = merge(
    orderResponse.data.orders,
    orderResponse.data.businesses.map((business) =>
      pick(business, [
        'businessName',
        'businessId',
        'avatarSource',
        'location',
      ]),
    ),
  );

  return {
    dashboardOrders: mergedOrders,
    dashboardRetailers: retailersResponse.data.retailers,
  };
};

export const useProducerDashboardQuery = (options = {}) =>
  useQuery({
    queryKey: producerDashboardQueryKey,
    queryFn: fetchProducerDashboard,
    ...options,
  });
