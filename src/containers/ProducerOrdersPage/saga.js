import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_ORDERS } from './constants';
import { ordersFetched, ordersFetchError } from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchOrders() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrdersData = () => privateRoute.get('/user/orders');
    const response = yield call(fetchOrdersData);

    console.log('ORDERS RETRIEVED', response.data);
    if (response.data) {
      yield put(ordersFetched(response.data));
    }
  } catch (err) {
    yield put(ordersFetchError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* ordersData() {
  yield takeLatest(FETCH_ORDERS, fetchOrders);
}
