import { createSelector } from 'reselect';
import { initialState } from '../../containers/App/reducer';

const selectGlobal = state => state.global || initialState;

export const makeSelectUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.user,
  );
