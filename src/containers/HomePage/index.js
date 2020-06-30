/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Header, Segment, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import messages from './messages';
import PageWrapper from '../../components/PageWrapper';

export default function HomePage() {
  return (
    <PageWrapper>
      {/* <Container textAlign="center"> */}
      <Header as="h1">
        <FormattedMessage {...messages.header} />
      </Header>
      <Segment basic>
        Create your profile
        {' '}
        <strong>
          <Link to="/create">here</Link>
        </strong>
      </Segment>
      {/* </Container> */}
    </PageWrapper>
  );
}
