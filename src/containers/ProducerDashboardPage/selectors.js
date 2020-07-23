import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProducerDashboardPage state domain
 */

const selectProducerDashboardPageDomain = (state) => state.ProducerDashboardPage || initialState;

/**
 * Other specific selectors
 */

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
};
