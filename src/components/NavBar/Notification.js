/**
 *
 * Notification
 *
 */

import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
import { Dropdown, Image, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
// import messages from './messages';
import { NOTIFICATION_TYPES } from '../../utils/constants';
import timeAgo from '../../utils/timeAgo';

const NotificationLinkStyled = styled(Link)`
  &&& {
    color: ${({ $isRead }) => ($isRead ? 'black' : '')};
  }
`;

const NotificationDropdownStyled = styled(Dropdown.Item)`
  &&& {
    background-color: ${({ $isRead }) => ($isRead ? '' : '#edf2fa !important')};
    border-bottom: 1px solid #d9d9d9;

    div.ui.grid {
      div.two.wide.column {
        padding-left: 0.5em;
        padding-right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      div.fourteen.wide.column {
        padding-left: 0.5em;

        .notification-text-content {
          white-space: normal;
          min-width: 300px;
          padding-right: 15px;
        }
      }
    }
  }
`;

const NotificationTimeStyled = styled.div`
  font-size: 10px;
  margin-top: 0.5em;
`;

function Notification({ notification }) {
  const [notificationObj, setNotificationObj] = useState(notification || {});

  useEffect(() => {
    // Only update if notification exists and has required properties
    // This prevents flickering when notification is being updated
    if (notification && notification.type && notification._id) {
      // Only update if it's actually different to prevent unnecessary re-renders
      setNotificationObj((prev) => {
        if (prev._id !== notification._id || prev.type !== notification.type) {
          return { ...notification };
        }
        return prev;
      });
    }
  }, [notification]);

  const handleClick = async () => {
    // const privateRoute = await getPrivateRoute();
    // const response = await privateRoute.patch(`/user/notification/${notificationObj._id}`);
    // const newNotification = response.data.notifications.filter((notif) => notif._id === notificationObj._id)[0];
    // setNotificationObj({ ...newNotification });
  };

  const notificationCopy = (notificationType, author) => {
    // Don't show "Loading..." if we don't have a type yet - just return empty or null
    if (!notificationType) {
      return null;
    }

    let message;
    switch (notificationType) {
      case NOTIFICATION_TYPES.newOrder:
        message = <>You have a new order from {author}!</>;
        break;
      case NOTIFICATION_TYPES.orderStatusChange:
        message = <>The status of your order from {author} has changed.</>;
        break;
      case NOTIFICATION_TYPES.newOrderMessage:
        message = <>Your order with {author} has a new message.</>;
        break;
      default:
        // Only show loading message if we have a notification but unknown type
        message = notificationObj._id ? 'You have a new notification.' : null;
        break;
    }
    return message;
  };

  // Don't render if we don't have the required notification data
  if (!notificationObj.type || !notificationObj._id) {
    return null;
  }

  const message = notificationCopy(notificationObj.type, notificationObj.name);
  if (!message) {
    return null;
  }

  return (
    <NotificationLinkStyled
      onClick={handleClick}
      to={`/order/${notificationObj.resourceId}`}
      $isRead={notificationObj.read}
    >
      <NotificationDropdownStyled $isRead={notificationObj.read}>
        <Grid width={16}>
          <Grid.Column width={2}>
            <Image
              src={notificationObj.image || '/images/avatars/blank-avatar.webp'}
              alt='user avatar'
              avatar
            />
          </Grid.Column>
          <Grid.Column width={14}>
            <div className='notification-text-content'>{message}</div>
            {notification?.updatedAt && (
              <NotificationTimeStyled className='notification-time'>
                {timeAgo.format(Date.parse(notification.updatedAt))}
              </NotificationTimeStyled>
            )}
          </Grid.Column>
        </Grid>
      </NotificationDropdownStyled>
    </NotificationLinkStyled>
    // <Feed.Event>
    //   <Feed.Label>
    //     <Image src={notificationObj.image || '/images/avatars/blank-avatar.webp'} alt="user avatar" avatar circular />
    //   </Feed.Label>
    //   <Feed.Content>
    //     <Feed.Summary>
    //       {notificationCopy(notificationObj.type, notificationObj.name)}
    //     </Feed.Summary>
    //     <Feed.Meta>
    //       <Feed.Date>{timeAgo.format(Date.parse(notification.updatedAt))}</Feed.Date>
    //     </Feed.Meta>
    //   </Feed.Content>
    // </Feed.Event>
  );
}

Notification.propTypes = {
  notification: PropTypes.object,
};
export default memo(Notification);

// export default Notification;
