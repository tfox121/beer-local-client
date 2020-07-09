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
import uploadAvatar from '../../utils/uploadAvatar';
import { getPrivateRoute } from '../../utils/api';
import createBlobUrl from '../../utils/createBlobUrl';
import { getOwnAvatar, getOwnBanner } from '../../utils/getImages';

function* saveProfile() {
  try {
    // Call our request helper (see 'utils/request')
    const newProfileData = yield select(makeSelectUserProfile());
    const privateRoute = yield call(getPrivateRoute);

    console.log(newProfileData);

    const saveUserData = (formValues, type) => privateRoute.post(
      `/user/${type}`, formValues, {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    const response = yield call(saveUserData, newProfileData, newProfileData.get('type'));

    if (response.data.user && response.data.business) {
      const bannerSource = yield call(getOwnBanner);
      const avatarSource = yield call(getOwnAvatar);

      yield put(profileSaved({
        ...response.data.business, ...response.data.user, bannerSource, avatarSource,
      }));
      if (newProfileData.type === 'producer') {
        yield put(push(`/brewery/${response.data.business.businessId}`));
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
