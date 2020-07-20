import produce from 'immer';
import {
  FETCH_ORDER,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_ERROR,
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_ERROR,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  CLEAR_ORDER,
} from './constants';

export const initialState = {
  fetchingOrder: false,
  fetchOrderError: false,
  editingOrder: false,
  editingOrderError: false,
  order: false,
  sendingMessage: false,
  sendingMessageError: false,
};

/* eslint-disable default-case, no-param-reassign */
const OrderPageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_ORDER:
      draftState.fetchOrderError = false;
      draftState.fetchingOrder = true;
      break;
    case FETCH_ORDER_SUCCESS:
      if (action.order) {
        draftState.order = action.order;
        draftState.fetchOrderError = false;
      }
      draftState.fetchingOrder = false;
      break;
    case FETCH_ORDER_ERROR:
      draftState.fetchOrderError = true;
      draftState.fetchingOrder = false;
      break;
    case EDIT_ORDER:
      draftState.editOrderError = false;
      draftState.editingOrder = true;
      break;
    case EDIT_ORDER_SUCCESS:
      if (action.order) {
        draftState.order = action.order;
        draftState.editOrderError = false;
      }
      draftState.editingOrder = false;
      break;
    case EDIT_ORDER_ERROR:
      draftState.editOrderError = true;
      draftState.editingOrder = false;
      break;
    case SEND_MESSAGE:
      draftState.sendingMessageError = false;
      draftState.sendingMessage = true;
      break;
    case SEND_MESSAGE_SUCCESS:
      if (action.order) {
        draftState.order = action.order;
        draftState.sendingMessageError = false;
      }
      draftState.sendingMessage = false;
      break;
    case SEND_MESSAGE_ERROR:
      draftState.sendingMessageError = true;
      draftState.sendingMessage = false;
      break;
    case CLEAR_ORDER:
      draftState.order = false;
      break;
  }
});

export default OrderPageReducer;
