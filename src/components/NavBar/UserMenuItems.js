import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Dropdown, Menu, Image, Icon,
} from 'semantic-ui-react';
import { useAuth0 } from '@auth0/auth0-react';

import styled from 'styled-components';
import messages from './messages';
import Notification from './Notification';
import { getPrivateRoute } from '../../utils/api';

export default function UserMenuItems({ avatarSource, notifications, businessName }) {
  const {
    user, isAuthenticated, loginWithRedirect, logout,
  } = useAuth0();
  const [notificationsArr, setNotificationsArr] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (notifications) {
      setNotificationsArr([...notifications]);
    }
  }, [notifications]);

  useEffect(() => {
    if (notificationsArr) {
      const unreadNotificationCount = notificationsArr.filter((notification) => (
        notification.read === false
      )).length;
      setUnreadNotifications(unreadNotificationCount);
    }
  }, [notificationsArr]);

  const handleClose = async () => {
    if (unreadNotifications) {
      const privateRoute = await getPrivateRoute();
      const response = await privateRoute.patch('/user/notifications');
      setNotificationsArr([...response.data.notifications]);
    }
  };

  const NotificationCircle = styled.div`
    position: absolute;
    display: flex;
    right: 10px;
    bottom: 8.5px;
    background-color: red;
    height: 12px;
    width: 12px;
    font-size: 10px;
    color: white;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  `;

  const StyledDropdownMenu = styled(Dropdown.Menu)`
    &&& {
      @media only screen and (max-width: 425px) {
        left: 0;
        right: 0;
        top: 50px;
        position: fixed;

        .item {
          white-space: normal;
        }
      }
    }
  `;

  if (isAuthenticated) {
    // eslint-disable-next-line no-unused-expressions
    return (
      <>
        <Dropdown
          onClose={handleClose}
          item
          icon={(
            <>
              <Icon
                fitted
                size="large"
                name={unreadNotifications ? 'bell' : 'bell outline'}
                color={unreadNotifications ? 'blue' : 'black'}
              />
              {!!unreadNotifications && (
                <NotificationCircle>
                  {unreadNotifications}
                </NotificationCircle>
              )}
            </>
          )}
          scrolling
        >
          <StyledDropdownMenu direction="left">
            {notificationsArr.length ? notificationsArr.map((notification) => (
              <React.Fragment key={notification._id}>
                <Notification notification={notification} />
              </React.Fragment>
            ))
              : (
                <Dropdown.Item disabled>
                  No notifications.
                </Dropdown.Item>
              )}
          </StyledDropdownMenu>
        </Dropdown>
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
              {businessName || user.name}
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
    <Menu.Item onClick={loginWithRedirect}>
      <FormattedMessage {...messages.logIn} />
    </Menu.Item>
  );
}

UserMenuItems.propTypes = {
  avatarSource: PropTypes.string,
  notifications: PropTypes.array,
  businessName: PropTypes.string,
};
