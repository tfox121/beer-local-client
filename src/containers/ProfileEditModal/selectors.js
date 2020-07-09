import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the profileEditModal state domain
 */

const ProfileEditModalDomain = (state) => state.profileEditModal || initialState;

/**
 * Other specific selectors
 */
const selectGlobal = (state) => state.global || initialState;
const selectProducerProfilePage = (state) => state.producerProfilePage || initialState;

const makeSelectUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.user,
);

const makeSelectUpdatingUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.updatingUser,
);

const makeSelectProducerProfile = () => createSelector(
  selectProducerProfilePage,
  (substate) => substate.profile,
);
/**
 * Default selector used by ProfileEditModal
 */

const makeProfileEditModal = () => createSelector(
  ProfileEditModalDomain,
  (substate) => substate,
);

export default makeProfileEditModal;
export {
  ProfileEditModalDomain, makeSelectUser, makeSelectUpdatingUser, makeSelectProducerProfile,
};
