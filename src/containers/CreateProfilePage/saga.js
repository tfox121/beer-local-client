import {
  takeLatest, call, put, select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { SAVE_PROFILE } from './constants';
import {
  profileSaved,
  profileSaveError,
} from './actions';
import { makeSelectUserProfile } from './selectors';
import { getPrivateRoute } from '../../utils/api';
// import { getOwnAvatar, getOwnBanner } from '../../utils/getImages';

function* saveProfile() {
  try {
    // Call our request helper (see 'utils/request')
    const newProfileData = yield select(makeSelectUserProfile());
    const privateRoute = yield call(getPrivateRoute);

    console.log(newProfileData);

    const saveUserData = (formValues, type) => privateRoute.post(
      '/user', formValues,
    );

    const response = yield call(saveUserData, newProfileData, newProfileData.type);

    if (response.data.user && response.data.business) {
      yield put(profileSaved({
        ...response.data.business, ...response.data.user,
      }));
      if (newProfileData.type === 'producer') {
        yield put(push(`/brewery/${response.data.user.businessId}`));
      } else {
        yield put(push('/'));
      }
    }
  } catch (err) {
    yield put(profileSaveError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* createProfilePageSaga() {
  // Watches for SAVE_PROFILE actions and calls getSession when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SAVE_PROFILE, saveProfile);
}
