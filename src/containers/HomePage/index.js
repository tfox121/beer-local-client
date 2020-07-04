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

import messages from './messages';
import PageWrapper from '../../components/PageWrapper';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth0();
  return (
    <PageWrapper>
      <Segment basic>
        <Header as="h1">
          <FormattedMessage {...messages.header} />
        </Header>
        {isAuthenticated && (
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
}
