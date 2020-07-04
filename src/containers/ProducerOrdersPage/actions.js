/*
 *
 * App actions
 *
 */

import {
  FETCH_ORDERS,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_ERROR,
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

export function clearOrders() {
  return {
    type: CLEAR_ORDERS,
  };
}
