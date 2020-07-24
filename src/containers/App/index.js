/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
// import { push } from 'connected-react-router';

import { push } from 'connected-react-router';
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
import ProducerDashboardPage from '../ProducerDashboardPage';

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

const App = ({
  userProfile, userFetch, userClear, pushRoute, location, fetchingUser, userFetchError,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { isAuthenticated, isLoading, error } = useAuth0();

  const userStatus = checkUserStatus(isLoading, error, isAuthenticated, fetchingUser, userFetchError, userProfile);

  console.log(userStatus);

  useEffect(() => {
    if (userStatus.authenticated && !userStatus.registered) {
      console.log('FETCHING');
      userFetch();
    }
    if (!userStatus.authenticated && !userStatus.loading && userStatus.registered) {
      console.log('CLEARING USER');
      userClear();
    }
    return () => {
      if (!userStatus.authenticated && !userStatus.loading && userStatus.registered) {
        console.log('CLEARING USER');
        userClear();
      }
    };
  }, [userProfile, location.pathname, isAuthenticated, userFetch, userClear]);

  if (userStatus.error) {
    console.log('User fetch error', userStatus.error);
    return (
      <Dimmer active page>
        <Segment padded="very">
          <Header as="h2">There has been an error.</Header>
          <Button as="a" href="/">Return to home</Button>
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

  console.log('RENDER APP');

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
        <ProtectedRoute exact path="/producerdash" isEnabled={userProfile.role === 'producer'} component={ProducerDashboardPage} />
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
  pushRoute: PropTypes.func,
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
    pushRoute: (path) => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(App);
