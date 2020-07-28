/* eslint-disable react/jsx-no-comment-textnodes */

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
import PhoneNumber from 'awesome-phonenumber';
import {
  Segment,
  Image,
  Grid,
  Header,
  Item,
  Pagination,
  Button,
  Modal,
  Card,
  Icon,
  Label,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { BLOG_ITEMS_PER_PAGE, PACK_SIZES } from '../../utils/constants';
import { makeSelectUser, makeSelectProducerProfile } from './selectors';
import { makeSelectLocation, makeSelectProducerFollowing } from '../App/selectors';
import {
  fetchProfile, clearProfile, addPromotion, deletePromotion,
} from './actions';
import { followProducer } from '../App/actions';
import reducer from './reducer';
import saga from './saga';
import { getPrivateRoute } from '../../utils/api';
import promotionCopySelection from '../../utils/promotionCopy';
// import messages from './messages';

import PageWrapper from '../../components/PageWrapper';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import StockModal from '../Stockmodal/StockModal';
// import AvailabilityBasic from './AvailabilityBasic';
// import AvailabilityDynamic from './AvailabilityDynamic';
import AvailabilityCategories from './AvailabilityCategories';
import ProducerBlogEditor from './ProducerBlogEditor';
import ProfileEditModal from '../ProfileEditModal';
import BlogPost from './BlogPost';
import PromotionModal from './PromotionModal';

import MapStyle from './MapStyle';
import BlogStyle from './BlogStyle';
import BannerStyle from './BannerStyle';

export function ProducerProfilePage({
  profileFetch,
  profileClear,
  producerProfile,
  user,
  routerLocation,
  producerFollow,
  producerFollowing,
  promotionAdd,
  promotionDelete,
}) {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const {
    sub,
    businessId,
    website,
    businessName,
    intro,
    salesEmail,
    salesContactNumber,
    location,
    distributionAreas,
    stock,
    blog,
    bannerSource,
    avatarSource,
  } = producerProfile;

  const { followedProducers } = user;

  const [producerFollowed, setProducerFollowed] = useState(false);
  const [blogPage, setBlogPage] = useState(1);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);

  useEffect(() => {
    if (followedProducers && sub) {
      const followedProducerList = followedProducers.map((producer) => producer.sub);
      if (followedProducerList.includes(sub)) {
        setProducerFollowed(true);
      }
    }
  }, [followedProducers, sub]);

  useEffect(() => {
    // if (Object.keys(user).length) {
    console.log('FETCHING PROFILE');
    profileFetch();
    // }
    return () => {
      console.log('CLEAR PROFILE');
      profileClear();
    };
  }, []);

  if (!producerProfile) {
    return null;
  }

  TimeAgo.addLocale(en);

  const handleFollowClick = async () => {
    producerFollow(producerProfile.sub);
  };

  const handleDeletePromo = async (id) => {
    // const privateRoute = await getPrivateRoute();
    // const response = await privateRoute.delete(`/producer/promotion/${id}`);
    // console.log(response);
    promotionDelete(id);
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
                    <Modal open={profileEditModalOpen} onClose={() => setProfileEditModalOpen(false)} closeIcon size="small" trigger={<Button onClick={() => setProfileEditModalOpen(true)} primary>Edit Profile</Button>}>
                      <Modal.Header>Edit profile</Modal.Header>
                      <ProfileEditModal profileEditModalOpen={profileEditModalOpen} setProfileEditModalOpen={setProfileEditModalOpen} location={routerLocation} />
                    </Modal>
                  )}
                  {(user && user.role === 'retailer') && (
                    <Button loading={producerFollowing} positive={followedProducers.map((producer) => producer.sub).includes(sub)} icon={followedProducers.map((producer) => producer.sub).includes(sub) ? 'check' : 'plus'} content={producerFollowed ? 'Following' : 'Follow'} onClick={handleFollowClick} />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </BannerStyle>
        <Segment basic className="wrapper" textAlign="center">
          <Grid columns={3} padded="vertically">
            <Grid.Row>
              <Grid.Column width={10} textAlign="left">
                <Header as="h1">{businessName}</Header>
                <Card fluid>
                  <Card.Content>
                    <Card.Description>{intro}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Label basic color="blue" as="a" href={website} target="_blank" rel="noopener noreferrer" content={website} icon="globe" />
                    <Label basic color="blue" as="a" href={`mailto:${salesEmail}`} target="_blank" rel="noopener noreferrer" content="email" icon="mail" />
                    <Label basic content={new PhoneNumber(salesContactNumber, 'GB').getNumber('national')} icon="phone" />
                  </Card.Content>
                </Card>
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
                      url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
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
        {/* ---------------------- Blog ---------------------- */}
        {producerProfile.profileOptions.activeModules.includes('blog') && (
          <Segment basic className="wrapper">
            <BlogStyle>
              <Grid columns={2} style={{ marginBottom: '0.05em' }}>
                <Grid.Column textAlign="left">
                  <Header as="h2">News</Header>
                </Grid.Column>
                <Grid.Column textAlign="right">
                  {(user && user.businessId === businessId)
                  && (
                    <ProducerBlogEditor />
                  )}
                </Grid.Column>
              </Grid>
              <>
                {blog && blog.length
                  ? blogRender(blog, blogPage)
                  : <Segment>No posts yet!</Segment>}
                {blog && blog.length > BLOG_ITEMS_PER_PAGE && (
                  <Segment basic textAlign="center">
                    <Pagination
                      secondary
                      size="tiny"
                      firstItem={null}
                      lastItem={null}
                      activePage={blogPage}
                      onPageChange={(e, { activePage }) => setBlogPage(activePage)}
                      totalPages={
                        blog
                          ? Math.ceil(blog.filter((blogPost) => blogPost.display === true || (user && user.businessId === businessId)).length / BLOG_ITEMS_PER_PAGE)
                          : 0
                      }
                    />
                  </Segment>
                )}
              </>
            </BlogStyle>
          </Segment>
        )}
        {/* ---------------------- Promotions ---------------------- */}
        {producerProfile.profileOptions.activeModules.includes('promotions') && (
          <Segment basic className="wrapper">
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column width={5} textAlign="left">
                <Header as="h2">Promotions</Header>
              </Grid.Column>
              <Grid.Column width={11} textAlign="right">
                {(user && user.businessId === businessId)
                && (
                  <>
                    <PromotionModal />
                  </>
                )}
              </Grid.Column>
            </Grid>
            <Segment>
              {(producerProfile.promotions && producerProfile.promotions.length) ? (
                <Item.Group divided>
                  {producerProfile.promotions.map((promotion) => {
                    const promotionCopy = promotionCopySelection(promotion, producerProfile.stock
                      .filter((stockItem) => stockItem.display === 'Show')
                      .map((stockItem) => ({
                        key: stockItem.id, value: stockItem.id, text: `${stockItem.name} - ${PACK_SIZES[stockItem.packSize]}`,
                      })));
                    if (!promotionCopy) {
                      return null;
                    }
                    return (
                      <Item key={promotion._id}>
                        <Item.Content>
                          <Grid verticalAlign="middle">
                            <Grid.Column width={14}>
                              <Icon circular name="pound sign" size="small" />
                              {' '}
                              {promotionCopy}
                            </Grid.Column>
                            <Grid.Column width={2}>
                              {(user && user.businessId === businessId)
                          && (
                            <Button negative compact basic size="small" icon="cancel" onClick={() => handleDeletePromo(promotion._id)} />
                          )}
                            </Grid.Column>
                          </Grid>
                        </Item.Content>
                      </Item>
                    );
                  })}
                </Item.Group>
              ) : (
                <>
                  No promotions currently available.
                </>
              )}

            </Segment>
          </Segment>
        )}
        {/* ---------------------- Availability ---------------------- */}
        {producerProfile.profileOptions.activeModules.includes('availability') && (
          <Segment basic className="wrapper">
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
        )}
      </PageWrapper>
    </>
  );
}

ProducerProfilePage.propTypes = {
  profileFetch: PropTypes.func.isRequired,
  profileClear: PropTypes.func.isRequired,
  producerProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  routerLocation: PropTypes.object,
  producerFollow: PropTypes.func,
  producerFollowing: PropTypes.bool,
  promotionDelete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  user: makeSelectUser(),
  routerLocation: makeSelectLocation(),
  producerFollowing: makeSelectProducerFollowing(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    profileFetch: () => dispatch(fetchProfile(location.pathname)),
    profileClear: () => dispatch(clearProfile()),
    producerFollow: (producerSub) => dispatch(followProducer(producerSub)),
    promotionDelete: (promotionId) => dispatch(deletePromotion(promotionId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProducerProfilePage);
