import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormattedMessage, defineMessages } from 'react-intl';

import LanguageProvider from '../index';

import { translationMessages } from '../../../i18n';

const messages = defineMessages({
  someMessage: {
    id: 'some.id',
    defaultMessage: 'This is some default message',
    en: 'This is some en message',
  },
});

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = <h1>Test</h1>;
    render(
      <LanguageProvider messages={messages} locale='en'>
        {children}
      </LanguageProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Test' })).not.toBeNull();
  });
});

describe('<LanguageProvider /> language messages', () => {
  it('should render the default language messages', () => {
    render(
      <LanguageProvider messages={translationMessages}>
        <FormattedMessage {...messages.someMessage} />
      </LanguageProvider>,
    );
    expect(
      screen.getByText(messages.someMessage.defaultMessage),
    ).not.toBeNull();
  });
});
