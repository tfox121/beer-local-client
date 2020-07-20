import {
  call, put, takeLatest, all,
} from 'redux-saga/effects';
import { FETCH_PRODUCERS } from './constants';
import { producersFetched, producersFetchError } from './actions';
import { publicRoute } from '../../utils/api';
import { getAvatar } from '../../utils/getImages';

function* fetchProducers() {
  try {
    const fetchProducersData = () => publicRoute.get('/producers');
    const response = yield call(fetchProducersData);

    // const images = yield all(response.data.map((producer) => call(getAvatar, producer.businessId)));

    const responseWithImages = response.data.map((producer, index) => ({
      ...producer,
      /* avatarSource: images[index]  */
    }));

    if (response.data) {
      yield put(producersFetched(responseWithImages));
    }
  } catch (err) {
    console.error(err);
    yield put(producersFetchError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* producersData() {
  yield takeLatest(FETCH_PRODUCERS, fetchProducers);
}
