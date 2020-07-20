import {
  call, debounce, put, spawn, takeLatest,
} from 'redux-saga/effects';
import {
  FETCH_PROFILE, UPDATE_PROFILE, UPDATE_PROFILE_OPTIONS, SEND_ORDER, BLOG_POST, BLOG_EDIT, UPDATE_STOCK,
} from './constants';
import {
  profileFetched,
  profileFetchError,
  profileUpdated,
  profileUpdateError,
  orderSent,
  orderSendError,
  blogPosted,
  blogPostError,
  blogEdited,
  blogEditError,
  stockUpdated,
  stockUpdateError,
  updateStock,
} from './actions';
import { publicRoute, getPrivateRoute } from '../../utils/api';
import { getBanner, getAvatar } from '../../utils/getImages';
import { producerFollowed, producerFollowError } from '../App/actions';
import { FOLLOW_PRODUCER } from '../App/constants';

function* fetchProfile({ pathName }) {
  try {
    const businessId = pathName.split('/')[2];

    const fetchProfileData = () => publicRoute.get(`/producer/${businessId}`);
    const response = yield call(fetchProfileData);

    console.log('PROFILE RETRIEVED', response.data);
    if (response.data) {
      yield put(profileFetched({
        ...response.data.business, ...response.data.user,
      }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileFetchError(err));
  }
}

function* updateProfile({ updateObj }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const updateProfileData = () => privateRoute.patch('/producer/profile', updateObj);

    const response = yield call(updateProfileData);

    console.log('RESPONSE', response.data);

    if (response.data) {
      yield put(profileUpdated({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileUpdateError(err));
  }
}

function* updateProfileOptions({ updateObj }) {
  console.log('UPDATING PROFILE');
  try {
    const privateRoute = yield call(getPrivateRoute);
    const fetchProfileData = () => privateRoute.patch('/producer/profile/options', updateObj);

    const response = yield call(fetchProfileData);

    if (response.data) {
      yield put(profileUpdated({ ...response.data.producer, ...response.data.user }));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(profileUpdateError(err));
  }
}

function* sendOrder({ orderInfo }) {
  console.log(orderInfo);
  try {
    const privateRoute = yield call(getPrivateRoute);
    const sendOrderData = () => privateRoute.post('/orders', orderInfo);

    const response = yield call(sendOrderData);

    if (response.data) {
      yield put(orderSent());
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(orderSendError(err));
  }
}

function* followProducer({ producerSub }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const followData = () => privateRoute.patch('/user/follow', { follow: producerSub });

    const response = yield call(followData);

    if (response.data) {
      yield put(producerFollowed(response.data));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(producerFollowError(err));
  }
}

function* blogPost({ blogPostData }) {
  try {
    const privateRoute = yield call(getPrivateRoute);
    const blogData = () => privateRoute.post('/producer/blog', blogPostData);

    const response = yield call(blogData);

    if (response.data) {
      yield put(blogPosted(response.data.blog));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(blogPostError(err));
  }
}

function* blogEdit({ blogEditData }) {
  try {
    const privateRoute = yield call(getPrivateRoute);

    const blogData = () => privateRoute.patch('/producer/blog', blogEditData);

    const response = yield call(blogData);

    if (response.data) {
      yield put(blogEdited(response.data.blog));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(blogEditError(err));
  }
}

function* stockUpdate({ stockEditData }) {
  try {
    const privateRoute = yield call(getPrivateRoute);

    const stockData = () => privateRoute.patch('/producer/stock', stockEditData);

    const response = yield call(stockData);

    if (response.data) {
      yield put(stockUpdated(response.data.stock));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(stockUpdateError(err));
  }
}

function* fetchProfileSaga() {
  yield debounce(500, FETCH_PROFILE, fetchProfile);
}

function* updateProfileSaga() {
  yield debounce(1000, UPDATE_PROFILE, updateProfile);
}

function* updateProfileOptionsSaga() {
  yield debounce(1000, UPDATE_PROFILE_OPTIONS, updateProfileOptions);
}

function* sendOrderSaga() {
  yield takeLatest(SEND_ORDER, sendOrder);
}

function* followProducerSaga() {
  yield debounce(1000, FOLLOW_PRODUCER, followProducer);
}

function* blogPostSaga() {
  yield takeLatest(BLOG_POST, blogPost);
}

function* blogEditSaga() {
  yield takeLatest(BLOG_EDIT, blogEdit);
}

function* stockUpdateSaga() {
  yield takeLatest(UPDATE_STOCK, stockUpdate);
}

export default function* rootSaga() {
  yield spawn(fetchProfileSaga);
  yield spawn(updateProfileSaga);
  yield spawn(updateProfileOptionsSaga);
  yield spawn(sendOrderSaga);
  yield spawn(followProducerSaga);
  yield spawn(blogPostSaga);
  yield spawn(blogEditSaga);
  yield spawn(stockUpdateSaga);
}
