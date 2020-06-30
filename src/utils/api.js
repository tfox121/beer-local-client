import axios from 'axios';
import getAuthToken from './getAuthToken';

const baseURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_DEV : process.env.REACT_APP_SERVER_PROD;

export const getPrivateRoute = async () => axios.create({
  baseURL: `${baseURL}/private`,
  headers: {
    Authorization: `Bearer ${await getAuthToken()}`,
  },
});

export const publicRoute = axios.create({ baseURL });

// export default axiosInstance;
