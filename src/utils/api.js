import axios from 'axios';
import getAuthToken from './getAuthToken';

export const baseURL = process.env.REACT_APP_SERVER;

export const getPrivateRoute = async () => axios.create({
  baseURL: `${baseURL}/api/private`,
  headers: {
    Authorization: `Bearer ${await getAuthToken()}`,
  },
  timeout: 10000,
});

export const publicRoute = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 10000,
});

// export default axiosInstance;
