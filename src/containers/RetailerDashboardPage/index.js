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
  Header, Segment, Button, Modal, Form, Grid, Message, Feed, Accordion, Icon,
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
      console.log(response.data);
      const { producers } = response.data;
      const producerInfo = producers.map((producer) => [...producer.stock, ...producer.blog]);

      const withProducerProps = producerInfo
        .map((producerItems, index) => producerItems
          .map((producerItem) => ({
            producer: producers[index].businessName, producerId: producers[index].businessId, avatarSource: producers[index].avatarSource, ...producerItem,
          })))
        .flat();
      console.log(withProducerProps);
      // eslint-disable-next-line no-nested-ternary
      const dateSorted = withProducerProps.sort((a, b) => (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0));
      console.log(dateSorted);
      setProducerFeed(dateSorted);
    };
    fetchProducers();
  }, []);

  if (!producerFeed) {
    return null;
  }

  const newItemRender = (item) => {
    const vowelRegex = '^[aieouAIEOU].*';
    return (
      <Feed.Event key={item._id}>
        <Feed.Label>
          <img src={item.avatarSource || '/images/avatars/blank-avatar.webp'} alt="producer avatar" />
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
            <Feed.User><Link to={`/brewery/${item.producerId}`}>{item.producer}</Link></Feed.User>
            {' '}
            added a new beer
            <Feed.Date>{timeAgo.format(Date.parse(item.createdAt))}</Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>
            {item.name}
            {' - '}
            {numToWords(Math.floor(item.abv)).match(vowelRegex) ? ' an ' : ' a ' }
            {item.abv}
            {'% '}
            {item.style}
            {' '}
            in
            {' '}
            {PACK_SIZES[item.packSize]}
            .
          </Feed.Extra>
          {item.imageSource && (
            <Feed.Extra images>
              <img src={item.imageSource} alt="product" />
            </Feed.Extra>
          )}
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
          added a new news item
          <Feed.Date>{timeAgo.format(Date.parse(item.createdAt))}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          <Segment>
            <Header><i>{item.title}</i></Header>
            <div dangerouslySetInnerHTML={{ __html: stateToHTML(EditorState.createWithContent(convertFromRaw(JSON.parse(item.blogData))).getCurrentContent()) }} />
          </Segment>
          {/* <Editor
            editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(item.blogData)))}
            // toolbarClassName={editingBlog ? 'blog-editor-toolbar' : ''}
            // wrapperClassName={editingBlog ? 'blog-editor-wrapper' : ''}
            // editorClassName={editingBlog ? 'blog-editor' : ''}
            readOnly
            toolbarHidden
          /> */}
        </Feed.Extra>
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
        <title>beerLocal - Dashboard</title>
        <meta name="description" content="Retailer dashboard" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">Dashboard</Header>
          <Feed size="large">
            {producerFeed.map((producerItem) => {
              if (producerItem.price) {
                return newItemRender(producerItem);
              }
              return newBlogRender(producerItem);
            })}
          </Feed>
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
