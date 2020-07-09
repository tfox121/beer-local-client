import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Dropdown, Menu, Image } from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

import messages from './messages';

export default function UserMenuItems({ avatarSource }) {
  const {
    user, isAuthenticated, loginWithRedirect, logout,
  } = useAuth0();

  if (isAuthenticated) {
    // eslint-disable-next-line no-unused-expressions
    return (
      <>
        <Dropdown
          item
          trigger={(
            <div>
              <Image src={avatarSource || '/images/avatars/blank-avatar.webp'} avatar />
            </div>
          )}
        >
          <Dropdown.Menu>
            <Dropdown.Header>
              <FormattedMessage {...messages.signedInAs} />
              {' '}
              {user.name}
            </Dropdown.Header>
            {/* <Dropdown.Item>
              <FormattedMessage {...messages.yourProfile} />
            </Dropdown.Item>
            <Dropdown.Item>
              <FormattedMessage {...messages.settings} />
            </Dropdown.Item> */}
            <Dropdown.Item onClick={() => logout()}>
              <FormattedMessage {...messages.logOut} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
  return (
    <Menu.Item onClick={() => loginWithRedirect()}>
      <FormattedMessage {...messages.logIn} />
    </Menu.Item>
  );
}

UserMenuItems.propTypes = {
  avatarSource: PropTypes.string,
};
