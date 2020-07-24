/*
 *
 * CreateProfilePage reducer
 *
 */
import produce from 'immer';
import {
  SAVE_PROFILE,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_ERROR,
} from './constants';

export const initialState = {
  savingUser: false,
  userSaveError: false,
  user: false,
  serverOrigin: false,
};

/* eslint-disable default-case, no-param-reassign */
const createProfilePageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case SAVE_PROFILE:
      draftState.userSaveError = false;
      draftState.savingUser = true;
      draftState.user = action.profileData;
      draftState.serverOrigin = false;
      break;
    case SAVE_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.user = action.profile;
        draftState.serverOrigin = true;
        draftState.userSaveError = false;
      }
      break;
    case SAVE_PROFILE_ERROR:
      draftState.userSaveError = true;
      break;
  }
});

export default createProfilePageReducer;
