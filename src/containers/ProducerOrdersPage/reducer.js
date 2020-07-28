import produce from 'immer';
import {
  FETCH_ORDERS,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_ERROR,
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_ERROR,
  CLEAR_ORDERS,
} from './constants';

export const initialState = {
  fetchingOrders: false,
  fetchOrdersError: false,
  editingOrder: false,
  editOrderError: false,
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
    case EDIT_ORDER:
      console.log(action);
      if (action.editObj) {
        draftState.editOrderError = false;
        draftState.editingOrder = action.editObj._id;
      }
      break;
    case EDIT_ORDER_SUCCESS:
      if (action.order) {
        draftState.orders.orders = draftState.orders.orders.map((order) => {

          if (order._id === action.order._id) {
            return action.order;
          }
          return order;
        });
        draftState.editOrderError = false;
      }
      draftState.editingOrder = false;
      break;
    case EDIT_ORDER_ERROR:
      draftState.editOrderError = true;
      draftState.editingOrder = false;
      break;
    case CLEAR_ORDERS:
      draftState.orders = false;
      break;
  }
});

export default producerOrdersPageReducer;
