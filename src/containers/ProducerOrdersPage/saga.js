import {
  call, put, takeLatest, all,
} from 'redux-saga/effects';
import { FETCH_ORDERS } from './constants';
import { ordersFetched, ordersFetchError } from './actions';
import { getPrivateRoute } from '../../utils/api';
import { getAvatar } from '../../utils/getImages';

function* fetchOrders() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrdersData = () => privateRoute.get('/orders');
    const response = yield call(fetchOrdersData);

    // console.log('ORDERS RETRIEVED', response.data);

    const images = yield all(response.data.businesses.map((business) => call(getAvatar, business.businessId)));

    // console.log('IMAGES', images);

    const data = { ...response.data, images };

    if (response.data) {
      yield put(ordersFetched(data));
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
