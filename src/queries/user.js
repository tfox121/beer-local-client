import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPrivateRoute } from '../utils/api';

export const userQueryKey = ['current-user'];

export const fetchCurrentUser = async () => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.get('/user');
  const { user, business } = response.data;

  if (!user || !business) {
    return null;
  }

  return {
    ...business,
    ...user,
  };
};

export const useUserQuery = (options = {}) => useQuery({
  queryKey: userQueryKey,
  queryFn: fetchCurrentUser,
  ...options,
});

export const followProducer = async producerSub => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch('/user/follow', { follow: producerSub });
  return response.data;
};

export const useFollowProducerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followProducer,
    onSuccess: data => {
      if (data && data.followedProducers) {
        queryClient.setQueryData(userQueryKey, previous => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            followedProducers: [...data.followedProducers],
          };
        });
      }

      queryClient.invalidateQueries({ queryKey: userQueryKey });
    },
  });
};

export const updateCurrentUser = async updateObj => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.patch('/user', updateObj);
  return response.data;
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: data => {
      if (data && data.user && data.business) {
        queryClient.setQueryData(userQueryKey, {
          ...data.business,
          ...data.user,
        });
      }

      queryClient.invalidateQueries({ queryKey: userQueryKey });
    },
  });
};

export const saveCurrentUser = async profileData => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post('/user', profileData);
  return response.data;
};

export const useSaveUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveCurrentUser,
    onSuccess: data => {
      if (data && data.user && data.business) {
        queryClient.setQueryData(userQueryKey, {
          ...data.business,
          ...data.user,
        });
      }

      queryClient.invalidateQueries({ queryKey: userQueryKey });
    },
  });
};
