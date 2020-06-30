/**
 *
 * MapMarker
 *
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';

function MapMarker({ location }) {
  return (
    <Marker position={location}>
      <Popup>
        <span>Your location.</span>
      </Popup>
    </Marker>
  );
}

MapMarker.propTypes = {
  location: PropTypes.object,
};

export default MapMarker;
