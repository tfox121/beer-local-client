/* eslint-disable no-underscore-dangle */
/**
 *
 * Notification
 *
 */

import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import {
  Menu, Dropdown, Icon, Image,
} from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import messages from './messages';
import { makeSelectUser } from './selectors';
import { notificationTypes } from '../../utils/constants';
import timeAgo from '../../utils/timeAgo';

function Notification({ notification }) {
  const [notificationObj, setNotificationObj] = useState({});

  useEffect(() => {
    if (notification) {
      setNotificationObj({ ...notification });
    }
  }, [notification]);

  const handleClick = async () => {
    // const privateRoute = await getPrivateRoute();
    // const response = await privateRoute.patch(`/user/notification/${notificationObj._id}`);
    // const newNotification = response.data.notifications.filter((notif) => notif._id === notificationObj._id)[0];
    // setNotificationObj({ ...newNotification });
  };

  const notificationCopy = (notificationType, author) => {
    let message;
    switch (notificationType) {
      case notificationTypes.newOrder:
        message = `You have a new order from ${author}!`;
        break;
      case notificationTypes.orderStatusChange:
        message = `The status of your order from ${author} has changed.`;
        break;
      case notificationTypes.newOrderMessage:
        message = `Your order with ${author} has a new message.`;
        break;
      default:
        message = 'You have a new notification. And this is it...';
        break;
    }
    return message;
  };

  const NotificationLinkStyled = styled(Link)`
  &&& {
    color: ${() => notification.read ? 'black' : ''};
  }
  `;

  const NotificationDropdownStyled = styled(Dropdown.Item)`
    &&& {
      background-color: ${() => notification.read ? '' : '#edf2fa !important'};
      border-bottom: 1px solid #d9d9d9;
    }
  `;

  const NotificationTimeStyled = styled.div`
    font-size: 10px;
    margin-top: 0.5em;
  `;

  return (
    <NotificationLinkStyled onClick={handleClick} to={`/order/${notificationObj.resourceId}`}>
      <NotificationDropdownStyled>
        {notificationCopy(notificationObj.type, notificationObj.name)}
        <NotificationTimeStyled className="notification-time">{timeAgo.format(Date.parse(notification.updatedAt))}</NotificationTimeStyled>
      </NotificationDropdownStyled>
    </NotificationLinkStyled>

  );
}

Notification.propTypes = {
  notification: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

export function mapDispatchToProps(dispatch) {
  return {
    pushRoute: (path) => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Notification);

// export default Notification;
