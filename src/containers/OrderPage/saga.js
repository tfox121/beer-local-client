import {
  call, put, takeLatest, debounce,
} from 'redux-saga/effects';
import { FETCH_ORDER } from './constants';
import { orderFetched, orderFetchError } from './actions';
import { getPrivateRoute } from '../../utils/api';
import { getAvatar } from '../../utils/getImages';

function* fetchOrder({ pathName }) {
  try {
    const orderId = pathName.split('/')[2];

    const privateRoute = yield call(getPrivateRoute);
    const fetchOrderData = () => privateRoute.get(`/orders/${orderId}`);
    const response = yield call(fetchOrderData);

    const image = yield call(getAvatar, response.data.business.businessId);

    const data = { ...response.data, image };

    console.log('ORDER RETRIEVED', data);

    if (response.data) {
      yield put(orderFetched(data));
    }
  } catch (err) {
    yield put(orderFetchError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* orderData() {
  yield debounce(2000, FETCH_ORDER, fetchOrder);
}
