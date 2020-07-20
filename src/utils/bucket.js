import axios from 'axios';

import dataURItoBlob from './dataURItoBlob';
import { getPrivateRoute } from './api';

export const getPresignedRoute = async (type, productId) => {
  const privateRoute = await getPrivateRoute();
  const response = await privateRoute.post('/image', { type, productId });
  console.log(response);
  return response.data;
};

export const imageToBucket = async (presignedRoute, imageDataURI) => {
  const formData = new FormData();

  Object.keys(presignedRoute.fields).forEach((formKey) => {
    formData.set(formKey, presignedRoute.fields[formKey]);
  });
  formData.set('file', dataURItoBlob(imageDataURI));
  return axios.post(
    presignedRoute.url,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};
