import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProducerOrdersPage state domain
 */

const selectProducerOrdersPageDomain = (state) => state.ProducerOrdersPage || initialState;

/**
 * Other specific selectors
 */
const makeSelectProducerOrders = () => createSelector(
  selectProducerOrdersPageDomain,
  (substate) => substate.orders,
);

/**
 * Default selector used by ProducerOrdersPage
 */

const makeSelectProducerOrdersPage = () => createSelector(
  selectProducerOrdersPageDomain,
  (substate) => substate,
);

export default makeSelectProducerOrdersPage;
export { selectProducerOrdersPageDomain, makeSelectProducerOrders };
