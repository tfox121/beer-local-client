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
} from './constants';

export const fetchProfile = (pathName) => ({
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

export function updateProfile(updateObj) {
  return {
    type: UPDATE_PROFILE,
    updateObj,
  };
}

export function updateProfileOptions(updateObj) {
  return {
    type: UPDATE_PROFILE_OPTIONS,
    updateObj,
  };
}

export function profileUpdated(profile) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    profile,
  };
}

export function profileUpdateError(error) {
  return {
    type: UPDATE_PROFILE_ERROR,
    error,
  };
}
