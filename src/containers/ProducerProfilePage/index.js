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
  Modal,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { makeSelectUser, makeSelectProducerProfile } from './selectors';
import { fetchProfile, clearProfile } from './actions';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

import PageWrapper from '../../components/PageWrapper';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import StockModal from '../Stockmodal/StockModal';
// import AvailabilityBasic from './AvailabilityBasic';
// import AvailabilityDynamic from './AvailabilityDynamic';
import AvailabilityCategories from './AvailabilityCategories';
import ProducerBlogEditor from './ProducerBlogEditor';

import MapStyle from './MapStyle';
import BlogStyle from './BlogStyle';
import BannerStyle from './BannerStyle';
import { BLOG_ITEMS_PER_PAGE } from '../../utils/constants';
import BlogPost from './BlogPost';
import ProfileEditModal from '../ProfileEditModal';
import { makeSelectLocation } from '../App/selectors';
import { getPrivateRoute } from '../../utils/api';
import createBlobUrl from '../../utils/createBlobUrl';

export function ProducerProfilePage({
  profileFetch,
  profileClear,
  producerProfile,
  user,
  routerLocation,
}) {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const {
    sub,
    businessId,
    avatarSource,
    bannerSource,
    website,
    businessName,
    intro,
    salesEmail,
    salesContactNumber,
    location,
    distributionAreas,
    stock,
    blog,
  } = producerProfile;

  const { followedProducers } = user;

  const [producerFollowed, setProducerFollowed] = useState(false);
  const [blogPage, setBlogPage] = useState(1);

  useEffect(() => {
    if (followedProducers && sub) {
      const followedProducerList = followedProducers.map((producer) => producer.sub);
      console.log('CHECKING', followedProducerList, sub);
      if (followedProducerList.includes(sub)) {
        setProducerFollowed(true);
      }
    }
  }, [followedProducers, sub]);

  useEffect(() => {
    if (Object.keys(user).length) {
      profileClear();
      profileFetch();
    }
  }, [user, profileClear, profileFetch]);

  if (!producerProfile) {
    return null;
  }

  TimeAgo.addLocale(en);

  const handleFollowClick = async () => {
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.patch('/user/follow', { follow: producerProfile.sub });
    setProducerFollowed(!producerFollowed);
    console.log(response.data);
  };

  const blogRender = (blogArray, page) => blogArray.filter((blogPost) => blogPost.display === true || (user && user.businessId === businessId)).map((blogPost, index) => {
    if (index < (page * BLOG_ITEMS_PER_PAGE) - BLOG_ITEMS_PER_PAGE || index >= page * BLOG_ITEMS_PER_PAGE) {
      return null;
    }
    return (
      <React.Fragment key={blogPost._id}>
        <BlogPost blogPost={blogPost} blogPage={blogPage} index={index} />
      </React.Fragment>
    );
  });

  return (
    <>
      <Helmet>
        <title>{`beerLocal - ${businessName}`}</title>
        <meta name="description" content={`${businessName} - profile`} />
      </Helmet>
      <PageWrapper>
        <BannerStyle>
          <div className="image-stack__item image-stack__item--bottom">
            <Grid.Row>
              <Grid.Column width={16}>
                <Image className="banner-image" src={bannerSource || '/images/banners/blank-banner.png'} centered />
              </Grid.Column>
            </Grid.Row>
          </div>
          <div className="image-stack__item image-stack__item--top">
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Image className="profile-image" src={avatarSource || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular />
                </Grid.Column>
                <Grid.Column width={7} />
                <Grid.Column className="profile-buttons" width={5} textAlign="right" verticalAlign="middle">
                  {(user && user.businessId === businessId) && (
                    <Modal closeIcon size="small" trigger={<Button primary>Edit Profile</Button>}>
                      <Modal.Header>Edit profile</Modal.Header>
                      <ProfileEditModal location={routerLocation} />
                    </Modal>
                  )}
                  {(user && user.role === 'retailer') && (
                    <Button positive={!producerFollowed} icon={producerFollowed ? 'check' : 'plus'} content={producerFollowed ? 'Following' : 'Follow'} onClick={handleFollowClick} />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </BannerStyle>
        <Segment basic textAlign="center">
          <Grid columns={3} padded="vertically">
            <Grid.Row>
              <Grid.Column width={10} textAlign="left">
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
              <Grid.Column width={6}>
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
                {(user && user.businessId === businessId)
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
              {(user && user.businessId === businessId)
                  && (
                    <>
                      {/* <Input value={stockCategoryNum} style={{ width: '60px', marginRight: '100px' }} onChange={(e) => setStockCategoryNum(e.target.value)} label="Categories" type="number" min={1} /> */}
                      <StockModal />
                    </>
                  )}
            </Grid.Column>
          </Grid>
          {/* <AvailabilityBasic stock={stock} /> */}
          {stock && (
            <AvailabilityCategories data={stock} />
          )}
        </Segment>
      </PageWrapper>
    </>
  );
}

ProducerProfilePage.propTypes = {
  profileFetch: PropTypes.func.isRequired,
  profileClear: PropTypes.func.isRequired,
  producerProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  user: makeSelectUser(),
  routerLocation: makeSelectLocation(),
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
