import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the RetailerDashboardPage state domain
 */

const selectRetailerDashboardPageDomain = (state) => state.RetailerDashboardPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RetailerDashboardPage
 */

const makeSelectRetailerDashboardPage = () => createSelector(
  selectRetailerDashboardPageDomain,
  (substate) => substate,
);

export default makeSelectRetailerDashboardPage;
export {
  selectRetailerDashboardPageDomain,
};
