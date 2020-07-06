import {
  call, debounce, put, spawn,
} from 'redux-saga/effects';
import { FETCH_PROFILE, UPDATE_PROFILE } from './constants';
import {
  profileFetched,
  profileFetchError,
} from './actions';
import { publicRoute, getPrivateRoute } from '../../utils/api';

function* fetchProfile({ pathName }) {
  try {
    const producerId = pathName.split('/')[2];

    const fetchProfileData = () => publicRoute.get(`/producer/${producerId}`);
    const response = yield call(fetchProfileData);

    console.log('PROFILE RETRIEVED', response.data);
    if (response.data) {
      yield put(profileFetched({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileFetchError(err));
  }
}

function* updateProfile({ updateObj }) {
  try {
    console.log(updateObj);
    const privateRoute = yield call(getPrivateRoute);

    const fetchProfileData = () => privateRoute.patch('/producer/profile', updateObj);

    const response = yield call(fetchProfileData);

    console.log('UPDATE RETRIEVED', response.data);
    if (response.data) {
      yield put(profileFetched({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileFetchError(err));
  }
}

// Individual exports for testing
function* fetchProfileSaga() {
  // See example in containers/HomePage/saga.js
  yield debounce(500, FETCH_PROFILE, fetchProfile);
}

function* updateProfileSaga() {
  yield debounce(1000, UPDATE_PROFILE, updateProfile);
}

export default function* rootSaga() {
  yield spawn(fetchProfileSaga);
  yield spawn(updateProfileSaga);
}
