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

const makeSelectOrderSending = () => createSelector(
  selectProducerProfilePageDomain,
  (substate) => substate.sendingOrder,
);

const makeSelectBlogPosting = () => createSelector(
  selectProducerProfilePageDomain,
  (substate) => substate.postingBlog,
);

const makeSelectStockUpdating = () => createSelector(
  selectProducerProfilePageDomain,
  (substate) => substate.updatingStock,
);

export default makeSelectProducerProfilePage;
export {
  selectProducerProfilePageDomain,
  makeSelectUser,
  makeSelectProducerProfile,
  makeSelectOrderSending,
  makeSelectBlogPosting,
  makeSelectStockUpdating,
};
