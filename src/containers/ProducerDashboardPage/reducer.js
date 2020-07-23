import produce from 'immer';
import {
  FETCH_ORDER,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_ERROR,
} from './constants';

export const initialState = {
  fetchingOrder: false,
  fetchOrderError: false,
  order: false,
};

/* eslint-disable default-case, no-param-reassign */
const ProducerDashboardPageReducer = (state = initialState, action) => produce(state, (draftState) => {
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
  }
});

export default ProducerDashboardPageReducer;
