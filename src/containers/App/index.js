/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
// import { push } from 'connected-react-router';

import { push } from 'connected-react-router';
import {
  makeSelectUser,
  makeSelectFetchingUser,
  makeSelectUserFetchError,
  makeSelectLocation,
} from './selectors';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
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
  min-width: 100%;
  // max-width: calc(768px + 16px * 2);
  margin: 49px auto 0;
  display: flex;
  min-height: calc(100vh - 51px);
  // padding: 0 16px;
  flex-direction: column;
`;

const App = ({
  userProfile, userFetch, userClear, pushRoute, location,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    console.log('AUTHENTICATED', isAuthenticated, isLoading);
    if (isAuthenticated && !userProfile.businessName) {
      userFetch();
    }
    if (!isAuthenticated && !isLoading && userProfile.businessName) {
      console.log('CLEARING USER');
      userClear();
      // pushRoute('/');
    }
    return () => {
      if (!isAuthenticated && !isLoading && userProfile.businessName) {
        console.log('CLEARING USER');
        userClear();
        // pushRoute('/');
      }
    };
  }, [userProfile, location.pathname, isAuthenticated, userFetch, userClear]);

  return (
    <AppWrapper>
      <NavBar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <ProtectedRoute exact path="/create" isEnabled={isAuthenticated && !userProfile.businessName} component={CreateProfilePage} />
        <Route exact path="/brewery/:id" component={ProducerProfilePage} />
        <ProtectedRoute exact path="/sales/orders" isEnabled={userProfile.businessName} component={ProducerOrdersPage} />
        <ProtectedRoute exact path="/breweries" isEnabled={userProfile.businessName} component={ProducerListPage} />
        <ProtectedRoute exact path="/order/:id" isEnabled={userProfile.businessName} component={OrderPage} />
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
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
  loading: makeSelectFetchingUser(),
  error: makeSelectUserFetchError(),
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
