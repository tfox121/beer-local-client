/*
 *
 * ProducerProfilePage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_OPTIONS,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  CLEAR_PROFILE,
} from './constants';

export const initialState = {
  fetchingProfile: false,
  fetchProfileError: false,
  updatingProfile: false,
  updateProfileError: false,
  profile: false,
};

/* eslint-disable default-case, no-param-reassign */
const producerProfilePageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_PROFILE:
      draftState.fetchProfileError = false;
      draftState.fetchingProfile = true;
      break;
    case FETCH_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.profile = action.profile;
        draftState.fetchProfileError = false;
      }
      draftState.fetchingProfile = false;
      break;
    case FETCH_PROFILE_ERROR:
      draftState.fetchProfileError = true;
      draftState.fetchingProfile = false;
      break;
    case CLEAR_PROFILE:
      draftState.profile = false;
      break;
    case UPDATE_PROFILE:
      draftState.updateProfileError = false;
      draftState.updatingProfile = true;
      break;
    case UPDATE_PROFILE_OPTIONS:
      draftState.updateProfileError = false;
      draftState.updatingProfile = true;
      break;
    case UPDATE_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.profile = action.profile;
        draftState.updateProfileError = false;
      }
      break;
    case UPDATE_PROFILE_ERROR:
      if (action.error) {
        draftState.updateProfileError = action.error;
        draftState.updatingProfile = false;
      }
      break;
  }
});

export default producerProfilePageReducer;
