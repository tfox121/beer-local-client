import {
  call, debounce, put, spawn,
} from 'redux-saga/effects';
import { FETCH_PROFILE, UPDATE_PROFILE, UPDATE_PROFILE_OPTIONS } from './constants';
import {
  profileFetched,
  profileFetchError,
  profileUpdated,
  profileUpdateError,
} from './actions';
import { publicRoute, getPrivateRoute } from '../../utils/api';
import { getBanner, getAvatar } from '../../utils/getImages';

function* fetchProfile({ pathName }) {
  try {
    const businessId = pathName.split('/')[2];

    const fetchProfileData = () => publicRoute.get(`/producer/${businessId}`);
    const response = yield call(fetchProfileData);

    const bannerSource = yield call(getBanner, businessId);
    const avatarSource = yield call(getAvatar, businessId);

    console.log('PROFILE RETRIEVED', response.data);
    if (response.data) {
      yield put(profileFetched({
        ...response.data.producer, ...response.data.user, bannerSource, avatarSource,
      }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileFetchError(err));
  }
}

function* updateProfile({ updateObj }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const updateProfileData = () => privateRoute.patch('/producer/profile', updateObj);

    const response = yield call(updateProfileData);

    if (response.data) {
      yield put(profileUpdated({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileUpdateError(err));
  }
}

function* updateProfileOptions({ updateObj }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchProfileData = () => privateRoute.patch('/producer/profile/options', updateObj);

    const response = yield call(fetchProfileData);

    if (response.data) {
      yield put(profileUpdated({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileUpdateError(err));
  }
}

function* fetchProfileSaga() {
  yield debounce(500, FETCH_PROFILE, fetchProfile);
}

function* updateProfileSaga() {
  yield debounce(1000, UPDATE_PROFILE, updateProfile);
}

function* updateProfileOptionsSaga() {
  yield debounce(1000, UPDATE_PROFILE_OPTIONS, updateProfileOptions);
}

export default function* rootSaga() {
  yield spawn(fetchProfileSaga);
  yield spawn(updateProfileSaga);
  yield spawn(updateProfileOptionsSaga);
}
