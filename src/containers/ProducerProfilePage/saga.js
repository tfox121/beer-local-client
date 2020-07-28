import {
  call, debounce, put, spawn, takeLatest,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import {
  FETCH_PROFILE, UPDATE_PROFILE, UPDATE_PROFILE_OPTIONS, SEND_ORDER, BLOG_POST, BLOG_EDIT, UPDATE_STOCK, ADD_PROMOTION, DELETE_PROMOTION,
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
  promotionAdded,
  promotionAddError,
} from './actions';
import { publicRoute, getPrivateRoute } from '../../utils/api';

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

      yield put(push(`/order/${response.data.order._id}`));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(orderSendError(err));
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

function* addPromotion({ promotionAddData }) {
  try {
    const privateRoute = yield call(getPrivateRoute);

    const promotionData = () => privateRoute.post('/producer/promotion', promotionAddData);

    const response = yield call(promotionData);

    if (response.data) {
      yield put(promotionAdded(response.data.promotions));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(promotionAddError(err));
  }
}

function* deletePromotion({ promotionId }) {
  try {
    const privateRoute = yield call(getPrivateRoute);

    const promotionData = () => privateRoute.delete(`/producer/promotion/${promotionId}`);

    const response = yield call(promotionData);

    if (response.data) {
      yield put(promotionAdded(response.data.promotions));
    }
  } catch (err) {
    console.log('ERROR', err);
    yield put(promotionAddError(err));
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
  yield debounce(2000, SEND_ORDER, sendOrder);
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

function* addPromotionSaga() {
  yield takeLatest(ADD_PROMOTION, addPromotion);
}

function* deletePromotionSaga() {
  yield takeLatest(DELETE_PROMOTION, deletePromotion);
}

export default function* rootSaga() {
  yield spawn(fetchProfileSaga);
  yield spawn(updateProfileSaga);
  yield spawn(updateProfileOptionsSaga);
  yield spawn(sendOrderSaga);
  yield spawn(blogPostSaga);
  yield spawn(blogEditSaga);
  yield spawn(stockUpdateSaga);
  yield spawn(addPromotionSaga);
  yield spawn(deletePromotionSaga);
}
