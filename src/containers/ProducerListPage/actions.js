/*
 *
 * ProducerListPage actions
 *
 */

import {
  FETCH_PRODUCERS,
  FETCH_PRODUCERS_SUCCESS,
  FETCH_PRODUCERS_ERROR,
  CLEAR_PRODUCERS,
} from './constants';

export const fetchProducers = () => ({
  type: FETCH_PRODUCERS,
});

export function producersFetched(producers) {
  return {
    type: FETCH_PRODUCERS_SUCCESS,
    producers,
  };
}

export function producersFetchError(error) {
  return {
    type: FETCH_PRODUCERS_ERROR,
    error,
  };
}

export function clearProducers() {
  return {
    type: CLEAR_PRODUCERS,
  };
}
