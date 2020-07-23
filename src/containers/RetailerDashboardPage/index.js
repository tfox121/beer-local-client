/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { Map, TileLayer } from 'react-leaflet';

import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Button, Modal, Form, Grid, Message, Feed, Accordion, Icon, Divider, Image,
} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser } from '../App/selectors';
import { getPrivateRoute } from '../../utils/api';
import timeAgo from '../../utils/timeAgo';
import { PACK_SIZES } from '../../utils/constants';
import numToWords from '../../utils/numToWords';
import RetailerDashboardStyle from './RetailerDashboardStyle';

const RetailerDashboardPage = ({
  userProfile,
}) => {
  useInjectReducer({ key: 'RetailerDashboardPage', reducer });
  useInjectSaga({ key: 'RetailerDashboardPage', saga });
  const [producerFeed, setProducerFeed] = useState([]);

  useEffect(() => {
    const fetchProducers = async () => {
      const privateRoute = await getPrivateRoute();
      const response = await privateRoute.get('/retailer/producers');
      const { followedProducers, nearbyProducers } = response.data;
      const producerInfo = followedProducers.map((producer) => [...producer.stock, ...producer.blog]);

      const withProducerProps = producerInfo
        .map((producerItems, index) => producerItems
          .map((producerItem) => ({
            producer: followedProducers[index].businessName, producerId: followedProducers[index].businessId, avatarSource: followedProducers[index].avatarSource, ...producerItem,
          })))
        .flat()
        .sort((a, b) => (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0));
      const grouped = withProducerProps.reduce((groups, producerItem) => {
        const date = producerItem.createdAt.split('T')[0];
        if (producerItem.price && producerItem.display === 'Show') {
          if (!groups[`${date}:${producerItem.producerId}`]) {
            groups[`${date}:${producerItem.producerId}`] = [];
          }
          groups[`${date}:${producerItem.producerId}`].push(producerItem);
        }
        return groups;
      }, {});
      const groupedArray = Object.keys(grouped).map((date) => ({
        createdAt: date.split(':')[0],
        producerItems: grouped[date],
      }));

      const fullArrayWithBeerGrouped = [...withProducerProps.filter((producerItem) => !producerItem.price), ...groupedArray, ...nearbyProducers];
      const dateSorted = fullArrayWithBeerGrouped.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0));
      console.log('SORTED', dateSorted);

      setProducerFeed(dateSorted);
    };
    fetchProducers();
  }, []);

  if (!producerFeed) {
    return null;
  }

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
            {itemGroup.producerItems.map((producerItem, index) => (
              <React.Fragment key={producerItem._id}>
                <Feed.Extra text>
                  {producerItem.name}
                  {' - '}
                  {numToWords(Math.floor(producerItem.abv)).match(vowelRegex) ? ' an ' : ' a '}
                  {producerItem.abv}
                  {'% '}
                  {producerItem.style}
                  {' '}
                  in
                  {' '}
                  {PACK_SIZES[producerItem.packSize]}
                  .
                </Feed.Extra>
                {
                  producerItem.imageSource && (
                    <Feed.Extra images>
                      <Image className="product-image" size="tiny" bordered centered circular src={producerItem.imageSource} alt="product" />
                      <p>{producerItem.description}</p>
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
          <Feed.User>{item.producer}</Feed.User>
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
          <Feed.User>{producer.businessName}</Feed.User>
          {' '}
          has joined beerLocal, and they deliver to your area!
          <Feed.Date>{timeAgo.format(Date.parse(producer.createdAt))}</Feed.Date>
        </Feed.Summary>
        <Segment>
          <Feed.Extra images>
            <Image size="small" centered src={producer.avatarSource || '/images/avatars/blank-avatar.webp'} alt="product" />
            <p>{producer.intro}</p>
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

  return (
    <>
      <Helmet>
        <title>beerLocal - Updates</title>
        <meta name="description" content="Retailer dashboard" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">Updates</Header>
          <RetailerDashboardStyle>
            <Feed size="large">
              {producerFeed.map((producerItem) => {
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
              })}
            </Feed>
          </RetailerDashboardStyle>
        </Segment>
      </PageWrapper>
    </>
  );
};

RetailerDashboardPage.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

// function mapDispatchToProps(dispatch) {
//   return {
//   };
// }

const withConnect = connect(
  mapStateToProps,
  // mapDispatchToProps,
);

export default compose(
  withConnect,
)(RetailerDashboardPage);
