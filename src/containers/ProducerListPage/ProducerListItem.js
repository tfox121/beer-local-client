import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Map, TileLayer } from 'react-leaflet';
import { push } from 'connected-react-router';

import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import { followProducer } from '../App/actions';
import { makeSelectProducerFollowing } from '../App/selectors';
import { MAP_TILE_PROVIDER_URL } from '../../utils/constants';

const ProducerListItem = ({
  producer, user, producerFollow, producerFollowing, pushRoute,
}) => {
  const [followButtonClicked, setFollowButtonClicked] = useState(false);

  useEffect(() => {
    if (!producerFollowing) {
      setFollowButtonClicked(false);
    }
  }, [producerFollowing]);

  const handleFollowClick = async () => {
    producerFollow(producer.sub);
    setFollowButtonClicked(true);
  };

  const handleClick = (businessId) => {
    pushRoute(`/brewery/${businessId}`);
  };

  return (
    <Table.Row key={producer._id}>
      <Table.Cell width={5}><Image className="image-link" onClick={() => handleClick(producer.businessId)} src={producer.avatarSource || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular /></Table.Cell>
      <Table.Cell width={6}>
        <div style={{ display: 'flex' }}>
          <Link to={`/brewery/${producer.businessId}`}><h2>{producer.businessName}</h2></Link>
          <Button size="mini" style={{ maxWidth: '100px', maxHeight: '30px', marginLeft: '1em' }} title={`${user.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub) ? 'Unfollow ' : 'Follow '}${producer.businessName}`} loading={followButtonClicked} positive={user.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub)} icon={user.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub) ? 'check' : 'plus'} onClick={handleFollowClick} />
        </div>
        <p>{producer.intro}</p>
      </Table.Cell>
      <Table.Cell width={5}>
        <Map center={producer.location} zoom={6} zoomControl={false}>
          <TileLayer
            url={MAP_TILE_PROVIDER_URL}
          />
          <DistributionAreaDisplay distributionAreas={producer.distributionAreas} />
          <MapMarker location={producer.location} />
          <MapMarker type="user" location={user.location} />
        </Map>
      </Table.Cell>
    </Table.Row>
  );
};

ProducerListItem.propTypes = {
  producer: PropTypes.object,
  user: PropTypes.object,
  producerFollow: PropTypes.func,
  producerFollowing: PropTypes.bool,
  pushRoute: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  producerFollowing: makeSelectProducerFollowing(),
});

function mapDispatchToProps(dispatch) {
  return {
    producerFollow: (producerSub) => dispatch(followProducer(producerSub)),
    pushRoute: (path) => dispatch(push(path)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProducerListItem);
