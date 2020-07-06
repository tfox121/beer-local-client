/*
 *
 * StockModal actions
 *
 */

import {
  UPDATE_STOCK,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_ERROR,
} from './constants';

export const updateStock = () => ({
  type: UPDATE_STOCK,
});

export function stockUpdated(stock) {
  return {
    type: UPDATE_STOCK_SUCCESS,
    stock,
  };
}

export function stockUpdateError(error) {
  return {
    type: UPDATE_STOCK_ERROR,
    error,
  };
}
