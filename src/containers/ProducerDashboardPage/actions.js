/*
 *
 * ProducerDashboardPage actions
 *
 */

import {
  FETCH_PRODUCER_DASHBOARD,
  FETCH_PRODUCER_DASHBOARD_SUCCESS,
  FETCH_PRODUCER_DASHBOARD_ERROR,
} from './constants';

export const fetchProducerDashboard = () => ({
  type: FETCH_PRODUCER_DASHBOARD,
});

export const producerDashboardFetched = (producerDashboard) => ({
  type: FETCH_PRODUCER_DASHBOARD_SUCCESS,
  producerDashboard,
});

export const producerDashboardFetchError = (error) => ({
  type: FETCH_PRODUCER_DASHBOARD_ERROR,
  error,
});
