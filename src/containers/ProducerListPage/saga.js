import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_PRODUCERS } from './constants';
import { producersFetched, producersFetchError } from './actions';
import { publicRoute } from '../../utils/api';

function* fetchProducers() {
  try {
    const fetchProducersData = () => publicRoute.get('/producers');
    const response = yield call(fetchProducersData);

    console.log(response);

    if (response.data) {
      yield put(producersFetched(response.data));
    }
  } catch (err) {
    yield put(producersFetchError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* producersData() {
  yield takeLatest(FETCH_PRODUCERS, fetchProducers);
}
