/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Header, Segment, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import messages from './messages';
import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser } from '../App/selectors';
import { fetchUser } from '../App/actions';
import RetailerDashboardPage from '../RetailerDashboardPage';
import ProducerDashboardPage from '../ProducerDashboardPage';

const HomePage = ({ userProfile, userFetch }) => {
  const { isAuthenticated } = useAuth0();

  // if (!userProfile.sub) {
  //   userFetch();
  // }
  console.log('HOME');

  const homeDisplay = (authenticated, user) => {
    if (authenticated && !user) {
      return (
        <PageWrapper>
          <Segment basic className="primary wrapper">
            <Header as="h1">
              <FormattedMessage {...messages.header} />
            </Header>
            <Message>
              <Message.Header>Create your profile</Message.Header>
              <p>
                Click
                {' '}
                <strong>
                  <Link to="/create">here</Link>
                </strong>
                {' '}
                to get started.
              </p>
            </Message>
          </Segment>
        </PageWrapper>
      );
    }
    if (user && user.role === 'retailer') {
      return <RetailerDashboardPage />;
    }
    if (user && user.role === 'producer') {
      return <ProducerDashboardPage />;
    }
    return (
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">
            <FormattedMessage {...messages.header} />
          </Header>
        </Segment>
      </PageWrapper>
    );
  };

  return (
    <>
      {homeDisplay(isAuthenticated, userProfile)}
    </>
  );
};

HomePage.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userFetch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

export function mapDispatchToProps(dispatch) {
  return {
    userFetch: () => dispatch(fetchUser()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(HomePage);
