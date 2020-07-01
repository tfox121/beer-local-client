/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

import {
  makeSelectUser,
  makeSelectFetchingUser,
  makeSelectUserFetchError,
} from './selectors';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import HomePage from '../HomePage/Loadable';
import CreateProfilePage from '../CreateProfilePage/Loadable';
import ProducerProfilePage from '../ProducerProfilePage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import NavBar from '../../components/NavBar/index';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';

import GlobalStyle from '../../global-styles';
import { fetchUser, clearUser } from './actions';

const key = 'global';
const AppWrapper = styled.div`
  min-width: 100%;
  // max-width: calc(768px + 16px * 2);
  margin: 49px auto 0;
  display: flex;
  min-height: calc(100vh - 51px);
  // padding: 0 16px;
  flex-direction: column;
`;

const App = ({ userProfile, userFetch, userClear }) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    // if (isAuthenticated) {
    //   userFetch();
    //   return;
    // }
    if (!isAuthenticated) {
      userClear();
    }
  }, [isAuthenticated]);

  if (isAuthenticated && user && user['https://beerlocal/apiroles'][0] !== 'Visitor' && !userProfile) {
    userFetch();
  }

  return (
    <AppWrapper>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/create" component={CreateProfilePage} />
        <Route exact path="/brewery/:id" component={ProducerProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
};

App.propTypes = {
  // userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userFetch: PropTypes.func,
  userClear: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
  loading: makeSelectFetchingUser(),
  error: makeSelectUserFetchError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    userFetch: () => dispatch(fetchUser()),
    userClear: () => dispatch(clearUser()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);
