/* eslint-disable no-underscore-dangle */
import {
  call, put, debounce, spawn,
} from 'redux-saga/effects';
import { FETCH_ORDER, EDIT_ORDER, SEND_MESSAGE } from './constants';
import {
  orderFetched, orderFetchError, orderEditError, orderEdited, messageSendError, messageSent,
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

function* editOrder({ editObj }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrderData = () => privateRoute.patch(`/orders/${editObj._id}`, {
      ...editObj,
    });
    const response = yield call(fetchOrderData);

    console.log('ORDER EDITED', response.data);

    if (response.data) {
      yield put(orderEdited(response.data));
    }
  } catch (err) {
    yield put(orderEditError(err));
  }
}

function* sendMessage({ messageContent }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchOrderData = () => privateRoute.post(`/orders/${messageContent._id}/message`, { content: messageContent.content });

    const response = yield call(fetchOrderData);

    console.log('MESSAGE SENT', response.data);

    if (response.data) {
      yield put(messageSent(response.data));
    }
  } catch (err) {
    yield put(messageSendError(err));
  }
}

function* fetchOrderSaga() {
  yield debounce(2000, FETCH_ORDER, fetchOrder);
}

function* editOrderSaga() {
  yield debounce(2000, EDIT_ORDER, editOrder);
}

function* sendMessageSaga() {
  yield debounce(2000, SEND_MESSAGE, sendMessage);
}

export default function* rootSaga() {
  yield spawn(fetchOrderSaga);
  yield spawn(editOrderSaga);
  yield spawn(sendMessageSaga);
}
