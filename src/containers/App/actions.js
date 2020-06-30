/*
 *
 * App actions
 *
 */

import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
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
