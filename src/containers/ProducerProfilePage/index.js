/* eslint-disable react/jsx-no-comment-textnodes */

/**
 *
 * ProducerProfilePage
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
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
  Responsive,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

import {
  BLOG_ITEMS_PER_PAGE,
  PACK_SIZES,
  MAP_TILE_PROVIDER_URL,
} from '../../utils/constants';
import promotionCopySelection from '../../utils/promotionCopy';
import {
  useDeletePromotionMutation,
  useProducerProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfileOptionsMutation,
} from '../../queries/producerProfile';
import { useFollowProducerMutation, useUserQuery } from '../../queries/user';
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
import AvailabilityMobile from './AvailabilityMobile';

export function ProducerProfilePage() {
  const { isAuthenticated } = useAuth0();
  const routerLocation = useLocation();
  const { data: user } = useUserQuery({ enabled: isAuthenticated });
  const { mutate: producerFollow, isLoading: producerFollowing } =
    useFollowProducerMutation();
  const producerBusinessId =
    routerLocation &&
    routerLocation.pathname &&
    routerLocation.pathname.split('/')[2];
  const {
    data: producerProfile,
    refetch: profileFetch,
    isLoading: fetchingProfile,
    isFetching: profileRefetching,
  } = useProducerProfileQuery(producerBusinessId);
  const { mutateAsync: promotionDeleteMutation } = useDeletePromotionMutation();
  const { mutateAsync: profileUpdateMutation } = useUpdateProfileMutation();
  const { mutateAsync: profileOptionsUpdateMutation } =
    useUpdateProfileOptionsMutation();

  const [producerFollowed, setProducerFollowed] = useState(false);
  const [blogPage, setBlogPage] = useState(1);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const followedProducers = useMemo(
    () => (user && user.followedProducers) || [],
    [user],
  );
  const followedProducerSubs = useMemo(
    () => followedProducers.map((producer) => producer.sub),
    [followedProducers],
  );
  const producerSub = producerProfile && producerProfile.sub;

  useEffect(() => {
    if (producerSub) {
      setProducerFollowed(followedProducerSubs.includes(producerSub));
    }
  }, [followedProducerSubs, producerSub]);

  const handleDeletePromo = useCallback(
    async (id) => {
      await promotionDeleteMutation(id);
      await profileFetch();
    },
    [promotionDeleteMutation, profileFetch],
  );

  const handleProfileUpdate = useCallback(
    async (updateObj) => {
      await profileUpdateMutation(updateObj);
      await profileFetch();
    },
    [profileUpdateMutation, profileFetch],
  );

  const handleProfileOptionsUpdate = useCallback(
    async (updateObj) => {
      await profileOptionsUpdateMutation(updateObj);
      await profileFetch();
    },
    [profileOptionsUpdateMutation, profileFetch],
  );

  if (fetchingProfile || !producerProfile) {
    return null;
  }

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

  TimeAgo.addLocale(en);

  const handleFollowClick = async () => {
    producerFollow(producerProfile.sub);
  };

  const blogRender = (blogArray, page) =>
    blogArray
      .filter(
        (blogPost) =>
          blogPost.display === true || (user && user.businessId === businessId),
      )
      .map((blogPost, index) => {
        if (
          index < page * BLOG_ITEMS_PER_PAGE - BLOG_ITEMS_PER_PAGE ||
          index >= page * BLOG_ITEMS_PER_PAGE
        ) {
          return null;
        }
        return (
          <React.Fragment key={blogPost._id}>
            <BlogPost
              user={user}
              businessId={businessId}
              blogPost={blogPost}
              blogPage={blogPage}
              index={index}
              onBlogEdited={profileFetch}
            />
          </React.Fragment>
        );
      });

  return (
    <>
      <Helmet>
        <title>{`BeerLocal - ${businessName}`}</title>
        <meta name='description' content={`${businessName} - profile`} />
      </Helmet>
      <PageWrapper>
        <BannerStyle>
          <div className='image-stack__item image-stack__item--bottom'>
            <Grid.Row>
              <Grid.Column width={16}>
                <Image
                  className='banner-image'
                  src={bannerSource || '/images/banners/blank-banner.png'}
                  centered
                  onError={(e) => {
                    e.target.src = '/images/banners/blank-banner.png';
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </div>
          <div className='image-stack__item image-stack__item--top'>
            <Grid>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Image
                    className='profile-image'
                    src={avatarSource || '/images/avatars/blank-avatar.webp'}
                    size='small'
                    bordered
                    centered
                    circular
                    onError={(e) => {
                      e.target.src = '/images/avatars/blank-avatar.webp';
                    }}
                  />
                </Grid.Column>
                <Grid.Column
                  className='profile-buttons'
                  width={12}
                  textAlign='right'
                  verticalAlign='middle'
                >
                  {user && user.businessId === businessId && (
                    <Modal
                      open={profileEditModalOpen}
                      onClose={() => setProfileEditModalOpen(false)}
                      closeIcon
                      size='small'
                      trigger={
                        <Button
                          onClick={() => setProfileEditModalOpen(true)}
                          primary
                        >
                          Edit Profile
                        </Button>
                      }
                    >
                      <Modal.Header>Edit profile</Modal.Header>
                      <ProfileEditModal
                        user={producerProfile}
                        profileEditModalOpen={profileEditModalOpen}
                        setProfileEditModalOpen={setProfileEditModalOpen}
                        location={routerLocation}
                        producerProfile={producerProfile}
                        profileUpdate={handleProfileUpdate}
                      />
                    </Modal>
                  )}
                  {user && user.role === 'retailer' && (
                    <Button
                      loading={producerFollowing}
                      positive={followedProducerSubs.includes(sub)}
                      icon={
                        followedProducerSubs.includes(sub) ? 'check' : 'plus'
                      }
                      content={producerFollowed ? 'Following' : 'Follow'}
                      onClick={handleFollowClick}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </BannerStyle>
        <Segment basic className='wrapper' textAlign='center'>
          <Grid columns={2} stackable reversed='mobile' padded='vertically'>
            <Grid.Row>
              <Grid.Column width={10} textAlign='left'>
                <Header as='h1'>{businessName}</Header>
                <Card fluid>
                  <Card.Content>
                    <Card.Description>{intro}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Label
                      basic
                      color='blue'
                      as='a'
                      href={website}
                      target='_blank'
                      rel='noopener noreferrer'
                      content={website}
                      icon='globe'
                    />
                    <Label
                      basic
                      color='blue'
                      as='a'
                      href={`mailto:${salesEmail}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      content='email'
                      icon='mail'
                    />
                    <Label
                      basic
                      color='blue'
                      as='a'
                      href={`tel:${new PhoneNumber(salesContactNumber, 'GB').getNumber('national')}`}
                      content={new PhoneNumber(
                        salesContactNumber,
                        'GB',
                      ).getNumber('national')}
                      icon='phone'
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column width={6}>
                <MapStyle>
                  <Map
                    className='profileViewMap'
                    center={location}
                    zoom={6}
                    zoomControl={false}
                  >
                    <TileLayer url={MAP_TILE_PROVIDER_URL} />
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
          <Segment basic className='wrapper'>
            <BlogStyle>
              <Grid columns={2} style={{ marginBottom: '0.05em' }}>
                <Grid.Column width={7} textAlign='left'>
                  <Header as='h2'>News</Header>
                </Grid.Column>
                <Grid.Column width={9} textAlign='right'>
                  {user && user.businessId === businessId && (
                    <ProducerBlogEditor onBlogPosted={profileFetch} />
                  )}
                </Grid.Column>
              </Grid>
              <>
                {blog && blog.length ? (
                  blogRender(blog, blogPage)
                ) : (
                  <Segment>No posts yet!</Segment>
                )}
                {blog && blog.length > BLOG_ITEMS_PER_PAGE && (
                  <Segment basic textAlign='center'>
                    <Pagination
                      secondary
                      size='tiny'
                      firstItem={null}
                      lastItem={null}
                      activePage={blogPage}
                      onPageChange={(e, { activePage }) =>
                        setBlogPage(activePage)
                      }
                      totalPages={
                        blog
                          ? Math.ceil(
                              blog.filter(
                                (blogPost) =>
                                  blogPost.display === true ||
                                  (user && user.businessId === businessId),
                              ).length / BLOG_ITEMS_PER_PAGE,
                            )
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
        {producerProfile.profileOptions.activeModules.includes(
          'promotions',
        ) && (
          <Segment basic className='wrapper'>
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column width={8} textAlign='left'>
                <Header as='h2'>Promotions</Header>
              </Grid.Column>
              <Grid.Column width={8} textAlign='right'>
                {user && user.businessId === businessId && (
                  <PromotionModal onPromotionAdded={profileFetch} />
                )}
              </Grid.Column>
            </Grid>
            <Segment>
              {producerProfile.promotions &&
              producerProfile.promotions.length ? (
                <Item.Group divided>
                  {producerProfile.promotions.map((promotion) => {
                    const promotionCopy = promotionCopySelection(
                      promotion,
                      producerProfile.stock
                        .filter((stockItem) => stockItem.display === 'Show')
                        .map((stockItem) => ({
                          key: stockItem.id,
                          value: stockItem.id,
                          text: `${stockItem.name} - ${PACK_SIZES[stockItem.packSize]}`,
                        })),
                    );
                    if (!promotionCopy) {
                      return null;
                    }
                    return (
                      <Item key={promotion._id}>
                        <Item.Content>
                          <Grid verticalAlign='middle'>
                            <Grid.Column
                              computer={
                                user && user.businessId === businessId ? 13 : 16
                              }
                            >
                              <Icon circular name='pound sign' size='small' />{' '}
                              {promotionCopy}
                            </Grid.Column>
                            {user && user.businessId === businessId && (
                              <Grid.Column width={2}>
                                <Button
                                  negative
                                  compact
                                  basic
                                  size='small'
                                  icon='cancel'
                                  onClick={() =>
                                    handleDeletePromo(promotion._id)
                                  }
                                />
                              </Grid.Column>
                            )}
                          </Grid>
                        </Item.Content>
                      </Item>
                    );
                  })}
                </Item.Group>
              ) : (
                <>No promotions currently available.</>
              )}
            </Segment>
          </Segment>
        )}
        {/* ---------------------- Availability ---------------------- */}
        {producerProfile.profileOptions.activeModules.includes(
          'availability',
        ) && (
          <Segment basic className='wrapper'>
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column width={8} textAlign='left'>
                <Header as='h2'>Availability</Header>
              </Grid.Column>
              <Grid.Column width={8} textAlign='right'>
                {user && user.businessId === businessId && (
                  <>
                    {/* <Input value={stockCategoryNum} style={{ width: '60px', marginRight: '100px' }} onChange={(e) => setStockCategoryNum(e.target.value)} label="Categories" type="number" min={1} /> */}
                    <StockModal
                      stock={stock}
                      fetchingProfile={fetchingProfile || profileRefetching}
                      onStockUpdated={profileFetch}
                    />
                  </>
                )}
              </Grid.Column>
            </Grid>
            {stock && (
              <>
                <Responsive minWidth={736}>
                  <AvailabilityCategories
                    data={stock}
                    producerProfile={producerProfile}
                    user={user}
                    profileOptionsUpdate={handleProfileOptionsUpdate}
                  />
                </Responsive>
                <Responsive maxWidth={735}>
                  <AvailabilityMobile
                    data={stock}
                    producerProfile={producerProfile}
                    user={user}
                    profileOptionsUpdate={handleProfileOptionsUpdate}
                  />
                </Responsive>
              </>
            )}
          </Segment>
        )}
      </PageWrapper>
    </>
  );
}

export default ProducerProfilePage;
