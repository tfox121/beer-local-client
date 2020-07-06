import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';

import {
  Header, Segment, Table, Image,
} from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import { Map, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { baseURL } from '../../utils/api';
import PageWrapper from '../../components/PageWrapper';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectProducerList } from './selectors';
import { fetchProducers, clearProducers } from './actions';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import ProducerListPageStyle from './ProducerListPageStyle';

const key = 'ProducerListPage';

const ProducerListPage = ({
  producers, producersFetch, pushRoute,
}) => {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    producersFetch();
  }, []);

  useEffect(() => {
    console.log(producers);
  }, [producers]);

  const handleClick = (producerId) => {
    pushRoute(`/brewery/${producerId}`);
  };

  return (
    <PageWrapper>
      <ProducerListPageStyle>
        <Segment basic>
          <Header as="h1">Breweries</Header>
          <Table basic>
            <Table.Body>
              {producers && producers.map((producer) => (
              // eslint-disable-next-line no-underscore-dangle
                <Table.Row key={producer._id}>
                  <Table.Cell width={5}><Image className="image-link" onClick={() => handleClick(producer.producerId)} src={`${baseURL}${producer.avatarSource}`} size="small" bordered centered circular /></Table.Cell>
                  <Table.Cell width={6}>
                    <Link to={`/brewery/${producer.producerId}`}><h2>{producer.businessName}</h2></Link>
                    <p>{producer.intro}</p>
                  </Table.Cell>
                  <Table.Cell width={5}>
                    <Map center={producer.location} zoom={6} zoomControl={false}>
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                      />
                      <DistributionAreaDisplay distributionAreas={producer.distributionAreas} />
                      <MapMarker location={producer.location} />
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
};

const mapStateToProps = createStructuredSelector({
  producers: makeSelectProducerList(),
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
