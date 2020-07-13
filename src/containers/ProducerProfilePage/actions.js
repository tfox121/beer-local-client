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
  UPDATE_PROFILE,
  UPDATE_PROFILE_OPTIONS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  SEND_ORDER,
  SEND_ORDER_SUCCESS,
  SEND_ORDER_ERROR,
} from './constants';

export const fetchProfile = (pathName) => ({
  type: FETCH_PROFILE,
  pathName,
});

export const profileFetched = (profile) => ({
  type: FETCH_PROFILE_SUCCESS,
  profile,
});

export const profileFetchError = (error) => ({
  type: FETCH_PROFILE_ERROR,
  error,
});

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

export const updateProfile = (updateObj) => ({
  type: UPDATE_PROFILE,
  updateObj,
});

export const updateProfileOptions = (updateObj) => ({
  type: UPDATE_PROFILE_OPTIONS,
  updateObj,
});

export const profileUpdated = (profile) => ({
  type: UPDATE_PROFILE_SUCCESS,
  profile,
});

export const profileUpdateError = (error) => ({
  type: UPDATE_PROFILE_ERROR,
  error,
});

export const sendOrder = (orderInfo) => ({
  type: SEND_ORDER,
  orderInfo,
});

export const orderSent = () => ({
  type: SEND_ORDER_SUCCESS,
});

export const orderSendError = (error) => ({
  type: SEND_ORDER_ERROR,
  error,
});
