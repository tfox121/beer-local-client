import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the OrderPage state domain
 */

const selectOrderPageDomain = (state) => state.OrderPage || initialState;

/**
 * Other specific selectors
 */
const makeSelectOrder = () => createSelector(
  selectOrderPageDomain,
  (substate) => substate.order,
);

/**
 * Default selector used by OrderPage
 */

const makeSelectOrderPage = () => createSelector(
  selectOrderPageDomain,
  (substate) => substate,
);

export default makeSelectOrderPage;
export { selectOrderPageDomain, makeSelectOrder };
