import { useQuery } from '@tanstack/react-query';
import { getPrivateRoute } from '../utils/api';
import normalizeProducerFeed from '../utils/normalizeProducerFeed';

export const retailerFeedQueryKey = ['retailer-feed'];

export const fetchRetailerFeed = async () => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get('/retailer/producers');
  return normalizeProducerFeed(response.data);
};

export const useRetailerFeedQuery = () =>
  useQuery({
    queryKey: retailerFeedQueryKey,
    queryFn: fetchRetailerFeed,
  });
