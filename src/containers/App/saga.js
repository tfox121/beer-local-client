/**
 * Gets the repositories of the user from Github
 */

import {
  call, put, spawn, debounce,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { FETCH_USER, UPDATE_USER } from './constants';
import {
  userFetched, userFetchError, userUpdated, userUpdateError,
} from './actions';
import { getPrivateRoute } from '../../utils/api';
import { getOwnAvatar, getOwnBanner } from '../../utils/getImages';
import createBlobUrl from '../../utils/createBlobUrl';

function* fetchUser() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchUserData = () => privateRoute.get('/user');
    const response = yield call(fetchUserData);

    console.log('USER RETRIEVED', response.data);
    if (Object.keys(response.data.user).length && Object.keys(response.data.business).length) {
      yield put(userFetched({
        ...response.data.business, ...response.data.user,
      }));
    } else {
      console.log('NO USER FOUND');
      // yield put(push('/create'));
    }
  } catch (err) {
    yield put(userFetchError(err));
    // yield put(push('/create'));
  }
}

function* updateUser({ updateObj, pathname }) {
  try {
    const businessId = pathname.split('/')[2];
    const privateRoute = yield call(getPrivateRoute);
    const updateUserProfile = () => privateRoute.patch('/user', updateObj);
    const response = yield call(updateUserProfile);

    console.log('USER UPDATED', response.data);
    if (Object.keys(response.data.user).length && Object.keys(response.data.business).length) {
      yield put(userUpdated({
        ...response.data.user, ...response.data.business,
      }));
      if (response.data.user.businessId !== businessId) {
        yield put(push(`/brewery/${response.data.user.businessId}`));
      }
    }
  } catch (err) {
    yield put(userUpdateError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
// export default function* userData() {
//   yield takeLatest(FETCH_USER, fetchUser);
// }

function* fetchUserSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(500, FETCH_USER, fetchUser);
}

function* updateUserSaga() {
  yield debounce(1000, UPDATE_USER, updateUser);
}

export default function* rootSaga() {
  yield spawn(fetchUserSaga);
  yield spawn(updateUserSaga);
}
