/*
 *
 * ProducerListPage reducer
 *
 */
import produce from 'immer';
import {
  FETCH_PRODUCERS,
  FETCH_PRODUCERS_SUCCESS,
  FETCH_PRODUCERS_ERROR,
  CLEAR_PRODUCERS,
} from './constants';

export const initialState = {
  fetchingProducers: false,
  fetchProducersError: false,
  producers: false,
};

/* eslint-disable default-case, no-param-reassign */
const producerListPageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_PRODUCERS:
      draftState.fetchProducersError = false;
      draftState.fetchingProducers = true;
      break;
    case FETCH_PRODUCERS_SUCCESS:
      if (action.producers) {
        draftState.producers = action.producers;
        draftState.fetchProducersError = false;
      }
      draftState.fetchingProducers = false;
      break;
    case FETCH_PRODUCERS_ERROR:
      draftState.fetchProducersError = true;
      draftState.fetchingProducers = false;
      break;
    case CLEAR_PRODUCERS:
      draftState.producers = false;
      break;
      // case CLOSE_SESSION_SUCCESS:
      //   draftState.session = false;
      //   draftState.closingSession = false;
      //   break;
  }
});

export default producerListPageReducer;
