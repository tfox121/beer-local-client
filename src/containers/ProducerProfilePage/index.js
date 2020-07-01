/**
 *
 * ProducerProfilePage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import {
  Container,
  Segment,
  Image,
  Grid,
  Header,
  Table,
} from 'semantic-ui-react';
import { Map, TileLayer } from 'react-leaflet';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { STOCK_HEADERS, PACK_SIZES } from '../../utils/constants';
import { baseURL } from '../../utils/api';
import makeSelectProducerProfilePage, { makeSelectUser } from './selectors';
import { fetchProfile, clearProfile } from './actions';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

import PageWrapper from '../../components/PageWrapper';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import StockModal from './StockModal';

import MapStyle from './MapStyle';
import AvailabilityBasic from './AvailabilityBasic';
import AvailabilityDynamic from './AvailabilityDynamic';

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
  } = producerProfilePage.profile;

  useEffect(() => {
    profileClear();
    profileFetch();
  }, []);

  console.log('USER', user);

  if (!producerProfilePage.profile) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${businessName} - Profile`}</title>
        <meta name="description" content="Description of ProducerProfilePage" />
      </Helmet>
      <PageWrapper>
        <Container>
          <Segment basic textAlign="center">

            <Grid columns={3} padded="vertically">
              <Grid.Row>
                <Grid.Column width={4} verticalAlign="middle">
                  <Image src={`${baseURL}${avatarSource}`} size="small" bordered centered circular />

                </Grid.Column>
                <Grid.Column width={8} textAlign="left">
                  <Header as="h1">{businessName}</Header>
                  <a href={website} target="_blank" rel="noreferrer">
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
            <Grid columns={2} style={{ marginBottom: '0.05em' }}>
              <Grid.Column textAlign="left">
                <Header as="h2">Available Items</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {(user && user.producerId === producerId)
                  && <StockModal />}
              </Grid.Column>
            </Grid>
            {/* <AvailabilityBasic stock={stock} /> */}
            <AvailabilityDynamic data={stock} />
          </Segment>
        </Container>
      </PageWrapper>
    </>
  );
}

ProducerProfilePage.propTypes = {
  profileFetch: PropTypes.func.isRequired,
  profileClear: PropTypes.func.isRequired,
  producerProfilePage: PropTypes.object,
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
