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
            <Image src={avatarSource} size="small" bordered centered circular />
            <a href={website} target="_blank" rel="noreferrer">
              {website}
            </a>
            <Grid columns={2} padded="vertically">
              <Grid.Row>
                <Grid.Column width={8} textAlign="left">
                  <Header as="h1">{businessName}</Header>
                  <p>{intro}</p>
                  <Header as="h3">Sales email</Header>
                  <p>{salesEmail}</p>
                  <Header as="h3">Sales telephone</Header>
                  <p>{salesContactNumber}</p>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Header as="h3">Distribution area</Header>
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
            <Grid columns={2}>
              <Grid.Column textAlign="left">
                <Header as="h2">Available Items</Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                {(user && user.producerId === producerId)
                  && <StockModal />}
              </Grid.Column>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  {STOCK_HEADERS.map((header) => (
                    <Table.HeaderCell key={header}>{header}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {stock.map((stockItem) => {
                  if (stockItem.display && stockItem.display === 'Show') {
                    return (
                      <Table.Row key={stockItem.id}>
                        <Table.Cell width={4}>{stockItem.name}</Table.Cell>
                        <Table.Cell>{stockItem.style}</Table.Cell>
                        <Table.Cell>
                          <NumberFormat
                            displayType="text"
                            decimalScale={1}
                            fixedDecimalScale
                            suffix="%"
                            value={stockItem.abv}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {PACK_SIZES[stockItem.packSize]}
                        </Table.Cell>
                        <Table.Cell>
                          <NumberFormat
                            displayType="text"
                            thousandSeparator
                            decimalScale={2}
                            fixedDecimalScale
                            prefix="£"
                            value={stockItem.price}
                          />
                        </Table.Cell>
                        <Table.Cell>{stockItem.availability}</Table.Cell>
                      </Table.Row>
                    );
                  }
                  return null;
                })}
              </Table.Body>
            </Table>
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
