/* eslint-disable no-underscore-dangle */
/**
 *
 * ProducerProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
  Segment,
  Image,
  Grid,
  Header,
  Item,
  Pagination,
  Button,
  Icon,
  Input,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { baseURL } from '../../utils/api';
import makeSelectProducerProfilePage, { makeSelectUser } from './selectors';
import { fetchProfile, clearProfile } from './actions';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

import PageWrapper from '../../components/PageWrapper';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import StockModal from '../Stockmodal/StockModal';
// import AvailabilityBasic from './AvailabilityBasic';
import AvailabilityDynamic from './AvailabilityDynamic';
import AvailabilityCategories from './AvailabilityCategories';
import ProducerBlogEditor from './ProducerBlogEditor';

import MapStyle from './MapStyle';
import BlogStyle from './BlogStyle';
import { BLOG_ITEMS_PER_PAGE } from '../../utils/constants';
import BlogPost from './BlogPost';

export function ProducerProfilePage({
  profileFetch,
  profileClear,
  producerProfilePage,
  user,
}) {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const {
    producerId,
    avatarSource,
    website,
    businessName,
    intro,
    salesEmail,
    salesContactNumber,
    location,
    distributionAreas,
    stock,
    blog,
    profileOptions,
  } = producerProfilePage.profile;

  const [blogPage, setBlogPage] = useState(1);
  const [stockCategoryNum, setStockCategoryNum] = useState('1');

  TimeAgo.addLocale(en);

  useEffect(() => {
    profileClear();
    profileFetch();
  }, []);

  useEffect(() => {
    if (profileOptions && profileOptions.stockCategories) {
      setStockCategoryNum(profileOptions.stockCategories.length);
    }
  }, [profileOptions]);

  const blogRender = (blogArray, page) => blogArray.filter((blogPost) => blogPost.display === true || (user && user.producerId === producerId)).map((blogPost, index) => {
    if (index < (page * BLOG_ITEMS_PER_PAGE) - BLOG_ITEMS_PER_PAGE || index >= page * BLOG_ITEMS_PER_PAGE) {
      return null;
    }
    return (
      <React.Fragment key={blogPost._id}>
        <BlogPost blogPost={blogPost} blogPage={blogPage} index={index} />
      </React.Fragment>
    );
  });

  if (!producerProfilePage.profile) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`beerLocal - ${businessName}`}</title>
        <meta name="description" content={`${businessName} - profile`} />
      </Helmet>
      <PageWrapper>
        <Segment basic textAlign="center">
          <Grid columns={3} padded="vertically">
            <Grid.Row>
              <Grid.Column width={4} verticalAlign="middle">
                <Image src={`${baseURL}${avatarSource}`} size="small" bordered centered circular />
              </Grid.Column>
              <Grid.Column width={8} textAlign="left">
                <Header as="h1">{businessName}</Header>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
                <p>{intro}</p>
                <Header as="h4">Contact</Header>
                <p>
                  Email:
                  {' '}
                  {salesEmail}
                  {' '}
                  / Tel:
                  {' '}
                  {salesContactNumber}
                </p>
              </Grid.Column>
              <Grid.Column width={4}>
                <MapStyle>
                  <Map
                    className="profileViewMap"
                    center={location}
                    zoom={6}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <DistributionAreaDisplay
                      distributionAreas={distributionAreas}
                    />
                    <MapMarker location={location} />
                  </Map>
                </MapStyle>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment basic>
          <BlogStyle>
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column textAlign="left">
                <Header as="h2">Updates</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {(user && user.producerId === producerId)
                  && (
                    <ProducerBlogEditor />
                  )}
              </Grid.Column>
            </Grid>
            <Item.Group divided>
              {blog && blog.length
                ? blogRender(blog, blogPage)
                : <Segment>No posts yet!</Segment>}
              {blog && blog.length > BLOG_ITEMS_PER_PAGE && (
                <Segment basic textAlign="center">
                  <Pagination
                    secondary
                    activePage={blogPage}
                    onPageChange={(e, { activePage }) => setBlogPage(activePage)}
                    totalPages={blog ? Math.ceil(blog.length / BLOG_ITEMS_PER_PAGE) : 0}
                  />
                </Segment>
              )}
            </Item.Group>
          </BlogStyle>
        </Segment>
        <Segment basic>
          <Grid columns={2} style={{ marginBottom: '0.05em' }}>
            <Grid.Column width={5} textAlign="left">
              <Header as="h2">Available Items</Header>
            </Grid.Column>
            <Grid.Column width={11} textAlign="right">
              {(user && user.producerId === producerId)
                  && (
                    <>
                      <Input value={stockCategoryNum} style={{ width: '60px', marginRight: '100px' }} onChange={(e) => setStockCategoryNum(e.target.value)} label="Categories" type="number" min={1} />
                      <StockModal />
                    </>
                  )}
            </Grid.Column>
          </Grid>
          {/* <AvailabilityBasic stock={stock} /> */}
          <AvailabilityCategories data={stock} stockCategoryNum={stockCategoryNum} />
        </Segment>
      </PageWrapper>
    </>
  );
}

ProducerProfilePage.propTypes = {
  profileFetch: PropTypes.func.isRequired,
  profileClear: PropTypes.func.isRequired,
  producerProfilePage: PropTypes.object,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  producerProfilePage: makeSelectProducerProfilePage(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    profileFetch: () => dispatch(fetchProfile(location.pathname)),
    profileClear: () => dispatch(clearProfile()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProducerProfilePage);
