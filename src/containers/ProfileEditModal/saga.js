import { call, put, takeLatest } from 'redux-saga/effects';
import { UPDATE_USER } from './constants';
import { userUpdated, userUpdateError } from '../App/actions';
import { getPrivateRoute } from '../../utils/api';
// import { fetchUser } from '../App/actions';

// function* updateUser({ updateObj }) {
//   try {
//     const privateRoute = yield call(getPrivateRoute);
//     const updateUserProfile = () => privateRoute.patch('/user', updateObj);
//     console.log('UPDATING SAGA', updateObj);
//     const response = yield call(updateUserProfile);

//     console.log('USER UPDATED', response.data);
//     if (Object.keys(response.data.user).length && Object.keys(response.data.business).length) {
//       console.log('UPDATING STATE');
//       yield put(userUpdated({ ...response.data.business, ...response.data.user }));
//       // yield call(fetchUser);
//     }
//   } catch (err) {
//     yield put(userUpdateError(err));
//   }
// }

// /**
//  * Root saga manages watcher lifecycle
//  */
// export default function* userData() {
//   yield takeLatest(UPDATE_USER, updateUser);
// }
