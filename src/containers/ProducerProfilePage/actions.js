/*
 *
 * ProducerProfilePage actions
 *
 */

import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_STOCK,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_ERROR,
} from './constants';

export const fetchProfile = pathName => ({
  type: FETCH_PROFILE,
  pathName,
});

export function profileFetched(profile) {
  return {
    type: FETCH_PROFILE_SUCCESS,
    profile,
  };
}

export function profileFetchError(error) {
  return {
    type: FETCH_PROFILE_ERROR,
    error,
  };
}

export function clearProfile() {
  return {
    type: CLEAR_PROFILE,
  };
}

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
