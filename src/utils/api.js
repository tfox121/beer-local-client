import axios from 'axios';
import getAuthToken from './getAuthToken';

export const baseURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_DEV : process.env.REACT_APP_SERVER_PROD;

export const getPrivateRoute = async () => axios.create({
  baseURL: `${baseURL}/api/private`,
  headers: {
    Authorization: `Bearer ${await getAuthToken()}`,
  },
});

export const publicRoute = axios.create({ baseURL: `${baseURL}/api` });

// export default axiosInstance;
