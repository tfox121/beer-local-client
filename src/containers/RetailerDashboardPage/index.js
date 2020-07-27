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
import FeedItem from './FeedItem';

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
      const groupedBeers = withProducerProps.reduce((groups, producerItem) => {
        if (producerItem.price && producerItem.display === 'Show') {
          const date = producerItem.firstDisplayed.split('T')[0];
          if (!groups[`${date}:${producerItem.producerId}`]) {
            groups[`${date}:${producerItem.producerId}`] = [];
          }
          groups[`${date}:${producerItem.producerId}`].push(producerItem);
        }
        return groups;
      }, {});
      const groupedBeersArray = Object.keys(groupedBeers).map((date) => ({
        createdAt: date.split(':')[0],
        producerItems: groupedBeers[date],
      }));

      const fullArrayWithBeerGrouped = [...withProducerProps.filter((producerItem) => !producerItem.price), ...groupedBeersArray, ...nearbyProducers];
      const dateSorted = fullArrayWithBeerGrouped.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
      console.log('SORTED', dateSorted);

      setProducerFeed(dateSorted);
    };
    fetchProducers();
  }, []);

  if (!producerFeed) {
    return null;
  }

  return (
    <PageWrapper>
      <Segment basic className="primary wrapper">
        <Header as="h1">Updates</Header>
        <RetailerDashboardStyle>
          <Feed size="large">
            {producerFeed.map((producerItem) => (
              <React.Fragment key={producerItem._id}>
                <FeedItem producerItem={producerItem} userProfile={userProfile} />
              </React.Fragment>
            ))}
          </Feed>
        </RetailerDashboardStyle>
      </Segment>
    </PageWrapper>
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
