/* eslint-disable no-underscore-dangle */
import {
  call, put, debounce, spawn,
} from 'redux-saga/effects';
import { FETCH_ORDER } from './constants';
import {
  orderFetched, orderFetchError,
} from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchOrder({ pathName }) {
  try {
    const orderId = pathName.split('/')[2];

    const privateRoute = yield call(getPrivateRoute);
    const fetchOrderData = () => privateRoute.get(`/orders/${orderId}`);
    const response = yield call(fetchOrderData);

    console.log('ORDER RETRIEVED', response.data);

    if (response.data) {
      yield put(orderFetched(response.data));
    }
  } catch (err) {
    yield put(orderFetchError(err));
  }
}

function* fetchOrderSaga() {
  yield debounce(2000, FETCH_ORDER, fetchOrder);
}

export default function* rootSaga() {
  yield spawn(fetchOrderSaga);
}
