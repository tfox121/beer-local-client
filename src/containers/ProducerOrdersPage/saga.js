import {
  call, put, takeLatest, all, debounce, spawn,
} from 'redux-saga/effects';
import { FETCH_ORDERS, EDIT_ORDER } from './constants';
import {
  ordersFetched, ordersFetchError, orderEditError, orderEdited,
} from './actions';
import { getPrivateRoute } from '../../utils/api';

function* fetchOrders() {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrdersData = () => privateRoute.get('/orders');
    const response = yield call(fetchOrdersData);

    // console.log('ORDERS RETRIEVED', response.data);

    // const images = yield all(response.data.businesses.map((business) => call(getAvatar, business.businessId)));

    // console.log('IMAGES', images);

    const data = { ...response.data /* images */ };

    if (response.data) {
      yield put(ordersFetched(data));
    }
  } catch (err) {
    yield put(ordersFetchError(err));
  }
}

function* editOrder({ editObj }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const editOrderData = () => privateRoute.patch(`/orders/${editObj._id}`, editObj);

    const response = yield call(editOrderData);
    if (response.data) {
      yield put(orderEdited(response.data.order));
    }
  } catch (err) {
    yield put(orderEditError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
function* fetchOrdersSaga() {
  yield debounce(2000, FETCH_ORDERS, fetchOrders);
}

function* editOrderSaga() {
  yield debounce(2000, EDIT_ORDER, editOrder);
}

export default function* rootSaga() {
  yield spawn(fetchOrdersSaga);
  yield spawn(editOrderSaga);
}
