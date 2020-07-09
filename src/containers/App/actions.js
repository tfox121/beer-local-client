/*
 *
 * App actions
 *
 */

import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  CLEAR_USER,
} from './constants';

export const fetchUser = () => ({
  type: FETCH_USER,
});

export function userFetched(user) {
  return {
    type: FETCH_USER_SUCCESS,
    user,
  };
}

export function userFetchError(error) {
  return {
    type: FETCH_USER_ERROR,
    error,
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}

export const updateUser = (updateObj, pathname) => ({
  type: UPDATE_USER,
  updateObj,
  pathname,
});

export function userUpdated(user) {
  return {
    type: UPDATE_USER_SUCCESS,
    user,
  };
}

export function userUpdateError(error) {
  return {
    type: UPDATE_USER_ERROR,
    error,
  };
}
