import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the producerProfilePage state domain
 */

const selectProducerProfilePageDomain = (state) => state.producerProfilePage || initialState;

/**
 * Other specific selectors
 */
const selectGlobal = (state) => state.global || initialState;
const makeSelectUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.user,
);
/**
 * Default selector used by ProducerProfilePage
 */

const makeSelectProducerProfilePage = () => createSelector(
  selectProducerProfilePageDomain,
  (substate) => substate,
);

const makeSelectProducerProfile = () => createSelector(
  selectProducerProfilePageDomain,
  (substate) => substate.profile,
);

export default makeSelectProducerProfilePage;
export { selectProducerProfilePageDomain, makeSelectUser, makeSelectProducerProfile };
