import { useQuery } from '@tanstack/react-query';
import { publicRoute } from '../utils/api';

export const producersQueryKey = ['producers'];

export const fetchProducers = async () => {
  const response = await publicRoute.get('/producers');
  return response.data.map((producer) => ({
    ...producer,
  }));
};

export const useProducersQuery = () =>
  useQuery({
    queryKey: producersQueryKey,
    queryFn: fetchProducers,
  });
