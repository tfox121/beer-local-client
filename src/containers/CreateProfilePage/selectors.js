import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;

/**
 * Direct selector to the createProfilePage state domain
 */

const selectCreateProfilePageDomain = (state) => state.createProfilePage || initialState;

/**
 * Other specific selectors
 */

const makeSelectUserProfile = () => createSelector(
  selectGlobal,
  (globalState) => globalState.user,
);

/**
 * Default selector used by CreateProfilePage
 */

const makeSelectCreateProfilePage = () => createSelector(
  selectCreateProfilePageDomain,
  (substate) => substate,
);

export default makeSelectCreateProfilePage;
export { selectCreateProfilePageDomain, makeSelectUserProfile };
