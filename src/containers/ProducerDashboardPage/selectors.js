import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProducerDashboardPage state domain
 */

const selectProducerDashboardPageDomain = (state) => state.ProducerDashboardPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectProducerDashboardOrders = () => createSelector(
  selectProducerDashboardPageDomain,
  (substate) => substate.dashboardOrders,
);

const makeSelectProducerDashboardRetailers = () => createSelector(
  selectProducerDashboardPageDomain,
  (substate) => substate.dashboardRetailers,
);

const makeSelectProducerDashboardFetching = () => createSelector(
  selectProducerDashboardPageDomain,
  (substate) => substate.fetchingProducerDashboard,
);

const makeSelectProducerDashboardFetchError = () => createSelector(
  selectProducerDashboardPageDomain,
  (substate) => substate.fetchingProducerDashboardError,
);

/**
 * Default selector used by ProducerDashboardPage
 */

const makeSelectProducerDashboardPage = () => createSelector(
  selectProducerDashboardPageDomain,
  (substate) => substate,
);

export default makeSelectProducerDashboardPage;
export {
  selectProducerDashboardPageDomain,
  makeSelectProducerDashboardOrders,
  makeSelectProducerDashboardRetailers,
  makeSelectProducerDashboardFetching,
  makeSelectProducerDashboardFetchError,
};
