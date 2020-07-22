/*
 *
 * RetailerDashboardPage actions
 *
 */

import {
  FETCH_ORDER,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_ERROR,
} from './constants';

export const fetchOrder = (pathName) => ({
  type: FETCH_ORDER,
  pathName,
});

export const orderFetched = (order) => ({
  type: FETCH_ORDER_SUCCESS,
  order,
});

export const orderFetchError = (error) => ({
  type: FETCH_ORDER_ERROR,
  error,
});
