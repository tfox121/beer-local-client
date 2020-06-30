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
  UPDATE_STOCK,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_ERROR,
} from './constants';

export const initialState = {
  fetchingProfile: false,
  fetchProfileError: false,
  updatingStock: false,
  updatingStockError: false,
  profile: false,
};

/* eslint-disable default-case, no-param-reassign */
const producerProfilePageReducer = (state = initialState, action) =>
  produce(state, draftState => {
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
      case UPDATE_STOCK:
        draftState.updatingStockError = false;
        draftState.updatingStock = true;
        break;
      case UPDATE_STOCK_SUCCESS:
        if (action.profile) {
          draftState.profile.stock = action.stock;
          draftState.updatingStockError = false;
        }
        draftState.updatingStock = false;
        break;
      case UPDATE_STOCK_ERROR:
        draftState.updatingStockError = true;
        draftState.updatingStock = false;
        break;
    }
  });

export default producerProfilePageReducer;
