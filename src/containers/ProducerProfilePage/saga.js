import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_PROFILE } from './constants';
import {
  profileFetched,
  profileFetchError,
} from './actions';
import { publicRoute } from '../../utils/api';

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
// Individual exports for testing
export default function* producerProfilePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(FETCH_PROFILE, fetchProfile);
}
