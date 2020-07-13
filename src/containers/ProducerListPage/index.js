import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import {
  Header, Segment, Table, Image, Checkbox, Dropdown, Grid,
} from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import { Map, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import rewind from '@mapbox/geojson-rewind';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import PageWrapper from '../../components/PageWrapper';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectProducerList } from './selectors';
import { fetchProducers, clearProducers } from './actions';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import ProducerListPageStyle from './ProducerListPageStyle';
import { makeSelectUser } from '../App/selectors';

const key = 'ProducerListPage';

const ProducerListPage = ({
  producers, producersFetch, pushRoute, user,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const [areaFilterToggle, setareaFilterToggle] = useState(true);
  const [followedFilterToggle, setfollowedFilterToggle] = useState(false);
  const [filter, setFilter] = useState([]);

  const checkPolygonsContainCoords = (polygonsObj, latlng) => {
    if (!polygonsObj) {
      return false;
    }
    const { lat, lng } = latlng;
    const rwGeoJson = rewind(polygonsObj, true);
    return d3.geoContains(rwGeoJson, [lng, lat]);
  };

  const followedProducers = !!user && user.followedProducers.map((producer) => producer.sub);

  const followedFilter = (producer) => followedProducers.includes(producer.sub);

  const areaFilter = (producer) => checkPolygonsContainCoords(producer.distributionAreas, user.location);

  // const filteredProducers = !!producers && !!user && producers.filter();

  const filterCombine = (producerArr) => {
    let filteredProducers = [...producerArr];
    if (filter.includes('area')) {
      filteredProducers = filteredProducers.filter(areaFilter);
    }
    if (filter.includes('followed')) {
      filteredProducers = filteredProducers.filter(followedFilter);
    }
    return filteredProducers;
  };

  // console.log('FILTERED', filteredProducers);

  // if (producers && user) {
  //   producers.forEach((producer) => {
  //     console.log(checkPolygonsContainCoords(producer.distributionAreas, user.location));
  //   });
  // }

  const handleChange = (e, { value }) => {
    setFilter(value);
  };

  useEffect(() => {
    producersFetch();
  }, [producersFetch]);

  const handleClick = (businessId) => {
    pushRoute(`/brewery/${businessId}`);
  };

  if (!user || !producers.length) {
    return null;
  }

  const filterOptions = [
    { key: 'area', text: 'In my area', value: 'area' },
    { key: 'followed', text: 'Followed breweries', value: 'followed' },
  ];

  return (
    <PageWrapper>
      <ProducerListPageStyle>
        <Segment basic className="primary wrapper">
          <Grid width={16}>
            <Grid.Column width={6}>
              <Header as="h1" floated="left">Breweries</Header>
            </Grid.Column>
            <Grid.Column width={10} textAlign="right">
              <Dropdown compact value={filter} onChange={handleChange} placeholder="Filter" multiple selection options={filterOptions} />
              {/* <Checkbox label="In my area" toggle checked={areaFilterToggle} onClick={() => setareaFilterToggle(!areaFilterToggle)} />
              {' '}
              <Checkbox label="Followed" toggle checked={followedFilterToggle} onClick={() => setfollowedFilterToggle(!followedFilterToggle)} /> */}
            </Grid.Column>
          </Grid>
          <Table basic unstackable>
            <Table.Body>
              {producers && filterCombine(producers).map((producer) => (
              // eslint-disable-next-line no-underscore-dangle
                <Table.Row key={producer._id}>
                  <Table.Cell width={5}><Image className="image-link" onClick={() => handleClick(producer.businessId)} src={producer.avatarSource || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular /></Table.Cell>
                  <Table.Cell width={6}>
                    <Link to={`/brewery/${producer.businessId}`}><h2>{producer.businessName}</h2></Link>
                    <p>{producer.intro}</p>
                  </Table.Cell>
                  <Table.Cell width={5}>
                    <Map center={producer.location} zoom={6} zoomControl={false}>
                      <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                      />
                      <DistributionAreaDisplay distributionAreas={producer.distributionAreas} />
                      <MapMarker location={producer.location} />
                      <MapMarker type="user" location={user.location} />
                    </Map>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      </ProducerListPageStyle>
    </PageWrapper>
  );
};

ProducerListPage.propTypes = {
  producers: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  producersFetch: PropTypes.func,
  pushRoute: PropTypes.func,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  producers: makeSelectProducerList(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    producersFetch: () => dispatch(fetchProducers()),
    producersClear: () => dispatch(clearProducers()),
    pushRoute: (path) => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(ProducerListPage);
