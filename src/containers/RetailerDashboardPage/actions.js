/*
 *
 * RetailerDashboardPage actions
 *
 */

import {
  FETCH_PRODUCER_FEED,
  FETCH_PRODUCER_FEED_SUCCESS,
  FETCH_PRODUCER_FEED_ERROR,
} from './constants';

export const fetchProducerFeed = () => ({
  type: FETCH_PRODUCER_FEED,
});

export const producerFeedFetched = (producerFeed) => ({
  type: FETCH_PRODUCER_FEED_SUCCESS,
  producerFeed,
});

export const producerFeedFetchError = (error) => ({
  type: FETCH_PRODUCER_FEED_ERROR,
  error,
});
