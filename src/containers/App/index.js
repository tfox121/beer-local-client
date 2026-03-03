/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useRef } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import {
  Dimmer, Loader, Button, Segment, Header,
} from 'semantic-ui-react';

import {
  makeSelectUser,
  makeSelectFetchingUser,
  makeSelectUserFetchError,
  makeSelectLocation,
} from './selectors';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import checkUserStatus from '../../utils/checkUserStatus';
import HomePage from '../HomePage/Loadable';
import CreateProfilePage from '../CreateProfilePage/Loadable';
import ProducerProfilePage from '../ProducerProfilePage/Loadable';
import ProducerOrdersPage from '../ProducerOrdersPage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import NavBar from '../../components/NavBar';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProducerListPage from '../ProducerListPage';
import OrderPage from '../OrderPage/Loadable';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';

import GlobalStyle from '../../global-styles';
import { fetchUser, clearUser } from './actions';

const key = 'global';
const AppWrapper = styled.div`
  background-color: #FDFDF0;
  min-width: 100%;
  // max-width: calc(768px + 16px * 2);
  margin: 49px auto 0;
  display: flex;
  min-height: calc(100vh - 51px);
  // padding: 0 16px;
  flex-direction: column;
`;

const App = ({
  userProfile, userFetch, userClear, location, fetchingUser, userFetchError,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { isAuthenticated, isLoading, error } = useAuth0();
  const lastPathnameRef = useRef(location.pathname);
  const hasFetchedForPathRef = useRef(false);

  const userStatus = checkUserStatus(isLoading, error, isAuthenticated, fetchingUser, userFetchError, userProfile);


  useEffect(() => {
    const checkStatus = checkUserStatus(isLoading, error, isAuthenticated, fetchingUser, userFetchError, userProfile);
    // Don't retry if there's a connection error
    if (checkStatus.authenticated && !checkStatus.registered && !checkStatus.notFound && !checkStatus.connectionError && !fetchingUser) {
      userFetch();
    }
    if (!checkStatus.authenticated && !checkStatus.loading && checkStatus.registered) {
      userClear();
    }
    return () => {
      if (!checkStatus.authenticated && !checkStatus.loading && checkStatus.registered) {
        userClear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, fetchingUser, userFetchError, userProfile?.sub]);

  useEffect(() => {
    // Only fetch on pathname change if user is registered, and only once per pathname
    const pathnameChanged = lastPathnameRef.current !== location.pathname;
    if (pathnameChanged) {
      lastPathnameRef.current = location.pathname;
      hasFetchedForPathRef.current = false;
    }

    const checkStatus = checkUserStatus(isLoading, error, isAuthenticated, fetchingUser, userFetchError, userProfile);
    // Don't retry if there's a connection error or already fetching
    if (pathnameChanged && checkStatus.authenticated && checkStatus.registered && !checkStatus.connectionError && !fetchingUser && !hasFetchedForPathRef.current) {
      hasFetchedForPathRef.current = true;
      userFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuthenticated, isLoading, fetchingUser, userFetchError]);

  if (userStatus.error) {
    const isConnectionError = userStatus.connectionError;
    return (
      <Dimmer active page>
        <Segment padded="very">
          <Header as="h2">
            {isConnectionError ? 'Unable to connect to server' : 'There has been an error.'}
          </Header>
          <p>
            {isConnectionError
              ? 'The backend server appears to be unavailable. Please check your connection or try again later.'
              : 'An error occurred while loading your data.'}
          </p>
          <Button
            onClick={() => {
              if (isConnectionError) {
                // Log out on connection error
                window.location.href = '/';
              } else {
                window.location.href = '/';
              }
            }}
          >
            {isConnectionError ? 'Return to login' : 'Return to home'}
          </Button>
        </Segment>
      </Dimmer>
    );
  }

  if (userStatus.loading) {
    return (
      <Dimmer active inverted page>
        <Loader />
      </Dimmer>
    );
  }


  return (
    <AppWrapper>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <ProtectedRoute exact path="/create" isEnabled={userStatus.authenticated && !userStatus.registered} component={CreateProfilePage} />
        <Route exact path="/brewery/:id" component={ProducerProfilePage} />
        <ProtectedRoute exact path="/sales/orders" isEnabled={userStatus.registered} component={ProducerOrdersPage} />
        <ProtectedRoute exact path="/breweries" isEnabled={userStatus.registered} component={ProducerListPage} />
        <ProtectedRoute exact path="/order/:id" isEnabled={userStatus.registered} component={OrderPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
};

App.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userFetch: PropTypes.func,
  userClear: PropTypes.func,
  location: PropTypes.object,
  fetchingUser: PropTypes.bool,
  userFetchError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
  fetchingUser: makeSelectFetchingUser(),
  userFetchError: makeSelectUserFetchError(),
  location: makeSelectLocation(),
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
)(App);
