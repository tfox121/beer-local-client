/*
 *
 * App actions
 *
 */

import {
  FETCH_ORDER,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_ERROR,
  CLEAR_ORDER,
} from './constants';

export const fetchOrder = (pathName) => ({
  type: FETCH_ORDER,
  pathName,
});

export function orderFetched(order) {
  return {
    type: FETCH_ORDER_SUCCESS,
    order,
  };
}

export function orderFetchError(error) {
  return {
    type: FETCH_ORDER_ERROR,
    error,
  };
}

export function clearOrder() {
  return {
    type: CLEAR_ORDER,
  };
}
