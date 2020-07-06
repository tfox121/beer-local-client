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

const HomePage = ({ userProfile }) => {
  const { isAuthenticated } = useAuth0();
  return (
    <PageWrapper>
      <Segment basic>
        <Header as="h1">
          <FormattedMessage {...messages.header} />
        </Header>
        {isAuthenticated && !userProfile && (
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
        )}
      </Segment>
    </PageWrapper>
  );
};

HomePage.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

const withConnect = connect(
  mapStateToProps,
);

export default compose(
  withConnect,
)(HomePage);
