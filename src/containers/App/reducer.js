/*
 *
 * App reducer
 *
 */
import produce from 'immer';
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

export const initialState = {
  fetchingUser: false,
  fetchUserError: false,
  updatingUser: false,
  updatingUserError: false,
  savingUser: false,
  userSaveError: false,
  user: false,
  followingProducer: false,
  followProducerError: false,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_USER:
      draftState.fetchUserError = false;
      draftState.fetchingUser = true;
      break;
    case FETCH_USER_SUCCESS:
      if (action.user) {
        draftState.user = { ...action.user };
        draftState.fetchUserError = false;
      }
      draftState.fetchingUser = false;
      break;
    case FETCH_USER_ERROR:
      if (action.error) {
        draftState.fetchUserError = action.error;
      } else {
        draftState.fetchUserError = true;
      }
      draftState.fetchingUser = false;
      break;
    case CLEAR_USER:
      draftState.user = false;
      break;
    case UPDATE_USER:
      draftState.updatingUserError = false;
      draftState.updatingUser = true;
      break;
    case UPDATE_USER_SUCCESS:
      if (action.user) {
        draftState.user = action.user;
        draftState.updatingUserError = false;
      }
      draftState.updatingUser = false;
      break;
    case UPDATE_USER_ERROR:
      draftState.updatingUserError = true;
      draftState.updatingUser = false;
      break;
    case SAVE_USER:
      draftState.userSaveError = false;
      draftState.savingUser = true;
      break;
    case SAVE_USER_SUCCESS:
      if (action.profile) {
        draftState.user = action.profile;
        draftState.userSaveError = false;
      }
      draftState.savingUser = false;
      break;
    case SAVE_USER_ERROR:
      draftState.savingUser = false;
      draftState.userSaveError = true;
      break;
    case FOLLOW_PRODUCER:
      draftState.followProducerError = false;
      draftState.followingProducer = true;
      break;
    case FOLLOW_PRODUCER_SUCCESS:
      if (action.followedProducers) {
        draftState.user.followedProducers = [...action.followedProducers];
        draftState.followingProducer = false;
      }
      break;
    case FOLLOW_PRODUCER_ERROR:
      draftState.followProducerError = true;
      draftState.followingProducer = false;
      break;
      // case CLOSE_SESSION_SUCCESS:
      //   draftState.session = false;
      //   draftState.closingSession = false;
      //   break;
  }
});

export default appReducer;
