import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Image, Button } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer } from 'react-leaflet';

import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import { MAP_TILE_PROVIDER_URL } from '../../utils/constants';
import { useFollowProducerMutation } from '../../queries/user';

const ProducerListItem = ({ producer, user }) => {
  const history = useHistory();
  const { mutate: followProducer, isLoading: producerFollowing } =
    useFollowProducerMutation();
  const [followButtonClicked, setFollowButtonClicked] = useState(false);

  useEffect(() => {
    if (!producerFollowing) {
      setFollowButtonClicked(false);
    }
  }, [producerFollowing]);

  const handleFollowClick = () => {
    followProducer(producer.sub);
    setFollowButtonClicked(true);
  };

  const handleClick = (businessId) => {
    history.push(`/brewery/${businessId}`);
  };

  const followedProducerSubs = (user.followedProducers || []).map(
    (followedProducer) => followedProducer.sub,
  );
  const isFollowed = followedProducerSubs.includes(producer.sub);

  return (
    <Table.Row key={producer._id}>
      <Table.Cell width={5}>
        <Image
          className='image-link'
          onClick={() => handleClick(producer.businessId)}
          src={producer.avatarSource || '/images/avatars/blank-avatar.webp'}
          size='small'
          bordered
          centered
          circular
        />
      </Table.Cell>
      <Table.Cell width={6}>
        <div style={{ display: 'flex' }}>
          <Link to={`/brewery/${producer.businessId}`}>
            <h2>{producer.businessName}</h2>
          </Link>
          <Button
            size='mini'
            style={{ maxWidth: '100px', maxHeight: '30px', marginLeft: '1em' }}
            title={`${isFollowed ? 'Unfollow ' : 'Follow '}${producer.businessName}`}
            loading={followButtonClicked}
            positive={isFollowed}
            icon={isFollowed ? 'check' : 'plus'}
            onClick={handleFollowClick}
          />
        </div>
        <p>{producer.intro}</p>
      </Table.Cell>
      <Table.Cell width={5}>
        <Map center={producer.location} zoom={6} zoomControl={false}>
          <TileLayer url={MAP_TILE_PROVIDER_URL} />
          <DistributionAreaDisplay
            distributionAreas={producer.distributionAreas}
          />
          <MapMarker location={producer.location} />
          <MapMarker type='user' location={user.location} />
        </Map>
      </Table.Cell>
    </Table.Row>
  );
};

ProducerListItem.propTypes = {
  producer: PropTypes.object,
  user: PropTypes.object,
};

export default ProducerListItem;
