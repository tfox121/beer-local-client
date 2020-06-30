/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import PageWrapper from '../../components/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
    </PageWrapper>
  );
}
