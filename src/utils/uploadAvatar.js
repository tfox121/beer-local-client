import { getPrivateRoute } from './api';

export default async function uploadAvatar(pictureFile) {
  const data = new FormData();
  data.append('myImage', pictureFile);

  const privateRoute = await getPrivateRoute();

  return privateRoute.post('/user/avatar', data);
}
