import {
  call, put, debounce, spawn,
} from 'redux-saga/effects';
import { FETCH_PRODUCER_FEED } from './constants';
import {
  producerFeedFetched, producerFeedFetchError,
} from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchProducerFeed() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchProducerFeedData = () => privateRoute.get('/retailer/producers');
    const response = yield call(fetchProducerFeedData);

    console.log('PRODUCER FEED RETRIEVED', response.data);

    if (response.data) {
      yield put(producerFeedFetched(response.data));
    }
  } catch (err) {
    yield put(producerFeedFetchError(err));
  }
}

function* fetchProducerFeedSaga() {
  yield debounce(2000, FETCH_PRODUCER_FEED, fetchProducerFeed);
}

export default function* rootSaga() {
  yield spawn(fetchProducerFeedSaga);
}
