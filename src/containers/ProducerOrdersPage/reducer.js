import produce from 'immer';
import {
  FETCH_ORDERS,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_ERROR,
  CLEAR_ORDERS,
} from './constants';

export const initialState = {
  fetchingOrders: false,
  fetchOrdersError: false,
  orders: false,
};

/* eslint-disable default-case, no-param-reassign */
const producerOrdersPageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_ORDERS:
      draftState.fetchOrdersError = false;
      draftState.fetchingOrders = true;
      break;
    case FETCH_ORDERS_SUCCESS:
      if (action.orders) {
        draftState.orders = action.orders;
        draftState.fetchOrdersError = false;
      }
      draftState.fetchingOrders = false;
      break;
    case FETCH_ORDERS_ERROR:
      draftState.fetchOrdersError = true;
      draftState.fetchingOrders = false;
      break;
    case CLEAR_ORDERS:
      draftState.orders = false;
      break;
  }
});

export default producerOrdersPageReducer;
