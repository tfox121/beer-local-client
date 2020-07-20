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

export const stockUpdated = (stock) => ({
  type: UPDATE_STOCK_SUCCESS,
  stock,
});

export const stockUpdateError = (error) => ({
  type: UPDATE_STOCK_ERROR,
  error,
});
