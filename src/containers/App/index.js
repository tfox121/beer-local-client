/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect, useRef } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Dimmer, Loader, Button, Segment, Header } from 'semantic-ui-react';
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
import { useUserQuery, userQueryKey } from '../../queries/user';
import GlobalStyle from '../../global-styles';
import { tr } from '../../utils/i18nRuntime';
const AppWrapper = styled.div`
  background-color: #fdfdf0;
  min-width: 100%;
  // max-width: calc(768px + 16px * 2);
  margin: 49px auto 0;
  display: flex;
  min-height: calc(100vh - 51px);
  // padding: 0 16px;
  flex-direction: column;
`;
const App = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();
  const location = useLocation();
  const queryClient = useQueryClient();
  const {
    data: userProfile,
    error: userFetchError,
    isLoading: fetchingUser,
    isFetching: userRefetching,
    refetch: userRefetch,
  } = useUserQuery({
    enabled: isAuthenticated,
  });
  const lastPathnameRef = useRef(location.pathname);
  const userStatus = checkUserStatus(
    isLoading,
    error,
    isAuthenticated,
    fetchingUser,
    userFetchError,
    userProfile,
  );
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      queryClient.removeQueries({
        queryKey: userQueryKey,
      });
    }
  }, [isAuthenticated, isLoading, queryClient]);
  useEffect(() => {
    const pathnameChanged = lastPathnameRef.current !== location.pathname;
    if (pathnameChanged) {
      lastPathnameRef.current = location.pathname;
    }
    const checkStatus = checkUserStatus(
      isLoading,
      error,
      isAuthenticated,
      userRefetching,
      userFetchError,
      userProfile,
    );
    if (
      pathnameChanged &&
      checkStatus.authenticated &&
      checkStatus.registered &&
      !checkStatus.connectionError &&
      !userRefetching
    ) {
      userRefetch();
    }
  }, [
    location.pathname,
    isAuthenticated,
    isLoading,
    error,
    userFetchError,
    userProfile,
    userRefetching,
    userRefetch,
  ]);
  if (userStatus.error) {
    const isConnectionError = userStatus.connectionError;
    return (
      <Dimmer active page>
        <Segment padded='very'>
          <Header as='h2'>
            {isConnectionError
              ? tr(
                  'containers.app.index.unable.to.connect.to.server',
                  'Unable to connect to server',
                )
              : tr(
                  'containers.app.index.there.has.been.an.error',
                  'There has been an error.',
                )}
          </Header>
          <p>
            {isConnectionError
              ? tr(
                  'containers.app.index.the.backend.server.appears.to.be.unavailable.please.check.your.connection.or.try.again.later',
                  'The backend server appears to be unavailable. Please check your connection or try again later.',
                )
              : tr(
                  'containers.app.index.an.error.occurred.while.loading.your.data',
                  'An error occurred while loading your data.',
                )}
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
            {isConnectionError
              ? tr('containers.app.index.return.to.login', 'Return to login')
              : tr('containers.app.index.return.to.home', 'Return to home')}
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
        <Route exact path='/' component={HomePage} />
        <ProtectedRoute
          exact
          path='/create'
          isEnabled={userStatus.authenticated && !userStatus.registered}
          component={CreateProfilePage}
        />
        <Route exact path='/producer/:id' component={ProducerProfilePage} />
        <ProtectedRoute
          exact
          path='/sales/orders'
          isEnabled={userStatus.registered}
          component={ProducerOrdersPage}
        />
        <ProtectedRoute
          exact
          path='/breweries'
          isEnabled={userStatus.registered}
          component={ProducerListPage}
        />
        <ProtectedRoute
          exact
          path='/order/:id'
          isEnabled={userStatus.registered}
          component={OrderPage}
        />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </AppWrapper>
  );
};
export default App;
