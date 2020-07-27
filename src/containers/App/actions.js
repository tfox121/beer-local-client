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
  SAVE_USER,
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR,
  CLEAR_USER,
  FOLLOW_PRODUCER,
  FOLLOW_PRODUCER_SUCCESS,
  FOLLOW_PRODUCER_ERROR,
} from './constants';

export const fetchUser = () => ({
  type: FETCH_USER,
});

export const userFetched = (user) => ({
  type: FETCH_USER_SUCCESS,
  user,
});

export const userFetchError = (error) => ({
  type: FETCH_USER_ERROR,
  error,
});

export const saveUser = (profileData) => ({
  type: SAVE_USER,
  profileData,
});

export const userSaved = (profile) => ({
  type: SAVE_USER_SUCCESS,
  profile,
});

export const userSaveError = (error) => ({
  type: SAVE_USER_ERROR,
  error,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const updateUser = (updateObj, pathname) => ({
  type: UPDATE_USER,
  updateObj,
  pathname,
});

export const userUpdated = (user) => ({
  type: UPDATE_USER_SUCCESS,
  user,
});

export const userUpdateError = (error) => ({
  type: UPDATE_USER_ERROR,
  error,
});

export const followProducer = (producerSub) => ({
  type: FOLLOW_PRODUCER,
  producerSub,
});

export const producerFollowed = ({ followedProducers }) => ({
  type: FOLLOW_PRODUCER_SUCCESS,
  followedProducers,
});

export const producerFollowError = (error) => ({
  type: FOLLOW_PRODUCER_ERROR,
  error,
});
