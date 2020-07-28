import {
  call, put, debounce, spawn,
} from 'redux-saga/effects';
import { FETCH_PRODUCER_DASHBOARD } from './constants';
import {
  producerDashboardFetched, producerDashboardFetchError,
} from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchProducerDashboard() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrderData = () => privateRoute.get('/orders');
    const orderResponse = yield call(fetchOrderData);

    const fetchRetailersData = () => privateRoute.get('/producer/retailers');
    const retailersResponse = yield call(fetchRetailersData);

    console.log('PRODUCER DASHBOARD DATA RETRIEVED');

    if (orderResponse.data && retailersResponse.data) {
      yield put(producerDashboardFetched({ orders: orderResponse.data, retailers: retailersResponse.data }));
    }
  } catch (err) {
    yield put(producerDashboardFetchError(err));
  }
}

function* fetchProducerDashboardSaga() {
  yield debounce(2000, FETCH_PRODUCER_DASHBOARD, fetchProducerDashboard);
}

export default function* rootSaga() {
  yield spawn(fetchProducerDashboardSaga);
}
