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
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
} from './constants';

export const initialState = {
  fetchingProfile: false,
  fetchProfileError: false,
  updatingProfile: false,
  updatingProfileError: false,
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
      draftState.updatingProfileError = false;
      draftState.updatingProfile = true;
      break;
    case UPDATE_PROFILE_SUCCESS:
      if (action.profile) {
        draftState.profile = action.profile;
        draftState.updatingProfileError = false;
      }
      draftState.updatingProfile = false;
      break;
    case UPDATE_PROFILE_ERROR:
      draftState.updatingProfileError = true;
      draftState.updatingProfile = false;
      break;
  }
});

export default producerProfilePageReducer;
