import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = (state) => state.global || initialState;

const selectRouter = (state) => state.router;

const makeSelectUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.user,
);

const makeSelectFetchingUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.fetchingUser,
);

const makeSelectUserFetchError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.fetchUserError,
);

const makeSelectProducerFollowing = () => createSelector(
  selectGlobal,
  (substate) => substate.followingProducer,
);

const makeSelectLocation = () => createSelector(
  selectRouter,
  (routerState) => routerState.location,
);

export {
  makeSelectUser,
  makeSelectFetchingUser,
  makeSelectUserFetchError,
  makeSelectLocation,
  makeSelectProducerFollowing,
};
