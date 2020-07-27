/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Feed, Segment, Image, Button, Header, Divider,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { stateToHTML } from 'draft-js-export-html';
import { EditorState, convertFromRaw } from 'draft-js';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import timeAgo from '../../utils/timeAgo';
import numToWords from '../../utils/numToWords';
import { PACK_SIZES } from '../../utils/constants';
import { followProducer } from '../App/actions';
import { makeSelectProducerFollowing } from '../App/selectors';

const FeedItem = ({
  producerItem, userProfile, producerFollow, producerFollowing,
}) => {
  const [producerFollowed, setProducerFollowed] = useState(false);

  useEffect(() => {
    if (userProfile.followedProducers && producerItem) {
      const followedProducerList = userProfile.followedProducers.map((producer) => producer.sub);
      if (followedProducerList.includes(producerItem.sub)) {
        setProducerFollowed(true);
      }
    }
  }, [userProfile, producerItem]);

  const handleFollowClick = async () => {
    producerFollow(producerItem.sub);
  };

  const multiNewItemRender = (itemGroup) => {
    const vowelRegex = '^[aieouAIEOU].*';
    if (itemGroup.producerItems.length === 1) {
      return (
        <Feed.Event key={`${itemGroup.createdAt}${itemGroup.producerItems[0].producerId}`}>
          <Feed.Label>
            <img src={itemGroup.producerItems[0].avatarSource || '/images/avatars/blank-avatar.webp'} alt="producer avatar" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User as="p"><Link to={`/brewery/${itemGroup.producerItems[0].producerId}`}>{itemGroup.producerItems[0].producer}</Link></Feed.User>
              {' '}
              added a new beer
              <Feed.Date>{timeAgo.format(Date.parse(itemGroup.producerItems[0].createdAt))}</Feed.Date>
            </Feed.Summary>
            <Segment>
              <Feed.Extra text>
                {itemGroup.producerItems[0].name}
                {' - '}
                {numToWords(Math.floor(itemGroup.producerItems[0].abv)).match(vowelRegex) ? ' an ' : ' a '}
                {itemGroup.producerItems[0].abv}
                {'% '}
                {itemGroup.producerItems[0].style}
                {' '}
                in
                {' '}
                {PACK_SIZES[itemGroup.producerItems[0].packSize]}
                .
              </Feed.Extra>
              {itemGroup.producerItems[0].imageSource && (
                <Feed.Extra images>
                  <Image className="product-image" size="tiny" bordered centered circular src={itemGroup.producerItems[0].imageSource} alt="product" />
                  <p>{itemGroup.producerItems[0].description}</p>
                </Feed.Extra>
              )}
            </Segment>
          </Feed.Content>
        </Feed.Event>
      );
    }
    return (
      <Feed.Event key={`${itemGroup.createdAt}${itemGroup.producerItems[0].producerId}`}>
        <Feed.Label>
          <img src={itemGroup.producerItems[0].avatarSource || '/images/avatars/blank-avatar.webp'} alt="producer avatar" />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User as="p"><Link to={`/brewery/${itemGroup.producerItems[0].producerId}`}>{itemGroup.producerItems[0].producer}</Link></Feed.User>
            {' '}
            added
            {' '}
            {itemGroup.producerItems.length}
            {' '}
            new beers
            <Feed.Date>{timeAgo.format(Date.parse(itemGroup.producerItems[0].createdAt))}</Feed.Date>
          </Feed.Summary>
          <Segment>
            {itemGroup.producerItems.map((producerSubItem, index) => (
              <React.Fragment key={producerSubItem._id}>
                <Feed.Extra text>
                  {producerSubItem.name}
                  {' - '}
                  {numToWords(Math.floor(producerSubItem.abv)).match(vowelRegex) ? ' an ' : ' a '}
                  {producerSubItem.abv}
                  {'% '}
                  {producerSubItem.style}
                  {' '}
                  in
                  {' '}
                  {PACK_SIZES[producerSubItem.packSize]}
                  .
                </Feed.Extra>
                {
                  producerSubItem.imageSource && (
                    <Feed.Extra images>
                      <Image className="product-image" size="tiny" bordered centered circular src={producerSubItem.imageSource} alt="product" />
                      <p>{producerSubItem.description}</p>
                    </Feed.Extra>
                  )
                }
                {index !== itemGroup.producerItems.length - 1 && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </Segment>
        </Feed.Content>
      </Feed.Event>
    );
  };

  const newBlogRender = (item) => (
    <Feed.Event key={item._id}>
      <Feed.Label>
        <img src={item.avatarSource || '/images/avatars/blank-avatar.webp'} alt="producer avatar" />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as="p"><Link to={`/brewery/${item.producerId}`}>{item.producer}</Link></Feed.User>
          {' '}
          posted some news
          <Feed.Date>{timeAgo.format(Date.parse(item.createdAt))}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          <Segment>
            <Header><i>{item.title}</i></Header>
            <div className="blog-text" dangerouslySetInnerHTML={{ __html: stateToHTML(EditorState.createWithContent(convertFromRaw(JSON.parse(item.blogData))).getCurrentContent()) }} />
          </Segment>
        </Feed.Extra>
        {/* <Feed.Meta>
            <Feed.Like>
              <Icon name='like' />4 Likes
          </Feed.Like>
          </Feed.Meta> */}
      </Feed.Content>
    </Feed.Event>
  );

  const newProducerRender = (producer) => (
    <Feed.Event key={producer.businessId}>
      <Feed.Label>
        <img src="/images/site-logo.png" alt="producer avatar" />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as="div"><Link to={`/brewery/${producer.businessId}`}>{producer.businessName}</Link></Feed.User>
          {' '}
          has joined beerLocal, and they deliver to your area!
          <Feed.Date>{timeAgo.format(Date.parse(producer.createdAt))}</Feed.Date>
        </Feed.Summary>
        <Segment>
          <Feed.Extra images style={{ flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <Image size="small" centered src={producer.avatarSource || '/images/avatars/blank-avatar.webp'} alt="product" />
              <p style={{ marginBottom: '0', paddingTop: '0' }}>{producer.intro}</p>
            </div>
            <Button style={{ maxWidth: '100px', maxHeight: '30px', alignSelf: 'flex-end' }} size="mini" loading={producerFollowing} positive={userProfile.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub)} icon={userProfile.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub) ? 'check' : 'plus'} content={producerFollowed ? 'Following' : 'Follow'} onClick={handleFollowClick} />
          </Feed.Extra>
        </Segment>
        {/* <Feed.Meta>
            <Feed.Like>
              <Icon name='like' />4 Likes
          </Feed.Like>
          </Feed.Meta> */}
      </Feed.Content>
    </Feed.Event>
  );

  if (producerItem.blogData) {
    return newBlogRender(producerItem);
  }
  if (producerItem.producerItems && producerItem.producerItems.length) {
    return multiNewItemRender(producerItem);
  }
  if (producerItem.role) {
    return newProducerRender(producerItem);
  }
  return null;
};

FeedItem.propTypes = {
  producerItem: PropTypes.object,
  userProfile: PropTypes.object,
  producerFollow: PropTypes.func,
  producerFollowing: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  producerFollowing: makeSelectProducerFollowing(),
});

function mapDispatchToProps(dispatch) {
  return {
    producerFollow: (producerSub) => dispatch(followProducer(producerSub)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FeedItem);
