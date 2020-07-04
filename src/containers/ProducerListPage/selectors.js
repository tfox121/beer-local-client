import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ProducerListPage state domain
 */

const selectProducerListPageDomain = (state) => state.ProducerListPage || initialState;

/**
 * Other specific selectors
 */
const makeSelectProducerList = () => createSelector(
  selectProducerListPageDomain,
  (substate) => substate.producers,
);

/**
 * Default selector used by ProducerListPage
 */

const makeSelectProducerListPage = () => createSelector(
  selectProducerListPageDomain,
  (substate) => substate,
);

export default makeSelectProducerListPage;
export { selectProducerListPageDomain, makeSelectProducerList };
