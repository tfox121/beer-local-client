/*
 *
 * CreateProfilePage actions
 *
 */

import {
  SAVE_PROFILE,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_ERROR,
} from './constants';

export const saveProfile = (profileData) => ({
  type: SAVE_PROFILE,
  profileData,
});

export function profileSaved(profile) {
  return {
    type: SAVE_PROFILE_SUCCESS,
    profile,
  };
}

export function profileSaveError(error) {
  return {
    type: SAVE_PROFILE_ERROR,
    error,
  };
}
