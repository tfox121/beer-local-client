/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { FETCH_USER } from './constants';
import { userFetched, userFetchError } from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchUser() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchUserData = () => privateRoute.get('/user');
    const response = yield call(fetchUserData);
    console.log('USER RETRIEVED', response.data);
    if (Object.keys(response.data.user).length && Object.keys(response.data.business).length) {
      yield put(userFetched({ ...response.data.user, ...response.data.business }));
    } else {
      yield put(push('/create'));
    }
  } catch (err) {
    yield put(userFetchError(err));
    yield put(push('/create'));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* userData() {
  yield takeLatest(FETCH_USER, fetchUser);
}
