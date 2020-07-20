/*
 *
 * App actions
 *
 */

import {
  FETCH_ORDERS,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_ERROR,
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_ERROR,
  CLEAR_ORDERS,
} from './constants';

export const fetchOrders = () => ({
  type: FETCH_ORDERS,
});

export function ordersFetched(orders) {
  return {
    type: FETCH_ORDERS_SUCCESS,
    orders,
  };
}

export function ordersFetchError(error) {
  return {
    type: FETCH_ORDERS_ERROR,
    error,
  };
}

export const editOrder = (editObj) => ({
  type: EDIT_ORDER,
  editObj,
});

export function orderEdited(order) {
  return {
    type: EDIT_ORDER_SUCCESS,
    order,
  };
}

export function orderEditError(error) {
  return {
    type: EDIT_ORDER_ERROR,
    error,
  };
}

export function clearOrders() {
  return {
    type: CLEAR_ORDERS,
  };
}
