/* eslint-disable no-underscore-dangle */
/**
 *
 * Notification
 *
 */

import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
import {
  Dropdown, Feed, Image, Grid,
} from 'semantic-ui-react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
// import messages from './messages';
import { makeSelectUser } from './selectors';
import { NOTIFICATION_TYPES } from '../../utils/constants';
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
      case NOTIFICATION_TYPES.newOrder:
        message = (
          <>
            You have a new order from
            {' '}
            {author}
            !
          </>
        );
        break;
      case NOTIFICATION_TYPES.orderStatusChange:
        message = (
          <>
            The status of your order from
            {' '}
            {author}
            {' '}
            has changed.
          </>
        );
        break;
      case NOTIFICATION_TYPES.newOrderMessage:
        message = (
          <>
            Your order with
            {' '}
            {author}
            {' '}
            has a new message.
          </>
        );
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
            padding-right: 15px
          }
        }
      }
    }
  `;

  const NotificationTimeStyled = styled.div`
    font-size: 10px;
    margin-top: 0.5em;
  `;

  return (
    <NotificationLinkStyled onClick={handleClick} to={`/order/${notificationObj.resourceId}`}>
      <NotificationDropdownStyled>
        <Grid width={16}>
          <Grid.Column width={2}>
            <Image src={notificationObj.image || '/images/avatars/blank-avatar.webp'} alt="user avatar" avatar />
          </Grid.Column>
          <Grid.Column width={14}>
            <div className="notification-text-content">{notificationCopy(notificationObj.type, notificationObj.name)}</div>
            <NotificationTimeStyled className="notification-time">{timeAgo.format(Date.parse(notification.updatedAt))}</NotificationTimeStyled>
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
