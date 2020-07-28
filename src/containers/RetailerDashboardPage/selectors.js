import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the RetailerDashboardPage state domain
 */

const selectRetailerDashboardPageDomain = (state) => state.RetailerDashboardPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectProducerFeed = () => createSelector(
  selectRetailerDashboardPageDomain,
  (substate) => substate.producerFeed,
);

const makeSelectProducerFeedFetching = () => createSelector(
  selectRetailerDashboardPageDomain,
  (substate) => substate.fetchingProducerFeed,
);

const makeSelectProducerFeedFetchError = () => createSelector(
  selectRetailerDashboardPageDomain,
  (substate) => substate.fetchingProducerFeedError,
);

/**
 * Default selector used by RetailerDashboardPage
 */

const makeSelectRetailerDashboardPage = () => createSelector(
  selectRetailerDashboardPageDomain,
  (substate) => substate,
);

export default makeSelectRetailerDashboardPage;
export {
  selectRetailerDashboardPageDomain, makeSelectProducerFeed, makeSelectProducerFeedFetching, makeSelectProducerFeedFetchError,
};
