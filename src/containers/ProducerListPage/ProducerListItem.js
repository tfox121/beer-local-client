/* eslint-disable no-underscore-dangle */
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

const ProducerListItem = ({
  producer, user, producerFollow, producerFollowing, pushRoute,
}) => {
  const [producerFollowed, setProducerFollowed] = useState(false);

  useEffect(() => {
    if (user.followedProducers && producer) {
      const followedProducerList = user.followedProducers.map((producerObj) => producerObj.sub);
      if (followedProducerList.includes(producer.sub)) {
        setProducerFollowed(true);
      }
    }
  }, [user, producer]);

  const handleFollowClick = async () => {
    producerFollow(producer.sub);
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
          <Button size="mini" style={{ maxWidth: '100px', maxHeight: '30px', marginLeft: '1em' }} title={`${producerFollowed ? 'Unfollow ' : 'Follow '}${producer.businessName}`} loading={producerFollowing} positive={user.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub)} icon={user.followedProducers.map((followedProducer) => followedProducer.sub).includes(producer.sub) ? 'check' : 'plus'} onClick={handleFollowClick} />
          {/* content={producerFollowed ? 'Following' : 'Follow'} */}
        </div>
        <p>{producer.intro}</p>
      </Table.Cell>
      <Table.Cell width={5}>
        <Map center={producer.location} zoom={6} zoomControl={false}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
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
