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
  CLEAR_USER,
} from './constants';

export const initialState = {
  fetchingUser: false,
  fetchUserError: false,
  updatingUser: false,
  updatingUserError: false,
  user: false,
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
        draftState.user = action.user;
        draftState.fetchUserError = false;
      }
      draftState.fetchingUser = false;
      break;
    case FETCH_USER_ERROR:
      draftState.fetchUserError = true;
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
      // case CLOSE_SESSION_SUCCESS:
      //   draftState.session = false;
      //   draftState.closingSession = false;
      //   break;
  }
});

export default appReducer;
