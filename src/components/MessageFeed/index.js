/* eslint-disable no-underscore-dangle */
/**
 *
 * MessageFeed
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Feed, Segment } from 'semantic-ui-react';

import timeAgo from '../../utils/timeAgo';
import MessageFeedStyle from './MessageFeedStyle';

function MessageFeed({
  messages, user, business, businessAvatar,
}) {
  if (!messages || !messages.length) {
    return null;
  }
  return (
    <Segment className="message-feed">
      <MessageFeedStyle>
        <Feed size="small">
          {messages.map((message) => (
            <Feed.Event key={message._id}>
              <Feed.Label>
                <img alt="business avatar" src={message.author === user.sub ? user.avatarSource : (businessAvatar || '/images/avatars/blank-avatar.webp')} />
              </Feed.Label>
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>{message.author === user.sub ? user.businessName : business.businessName}</Feed.User>
                  <Feed.Date>{timeAgo.format(Date.parse(message.createdAt))}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>{message.content}</Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </MessageFeedStyle>
    </Segment>
  );
}

MessageFeed.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  business: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  businessAvatar: PropTypes.string,
};

export default MessageFeed;
