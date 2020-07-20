/**
 *
 * MapMarker
 *
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import L, { divIcon } from 'leaflet';
import { Icon } from 'semantic-ui-react';

const manIconMarkup = renderToStaticMarkup(<Icon size="big" name="street view" />);
const dotIconMarkup = renderToStaticMarkup(<Icon name="dot circle outline" color="blue" />);

const manIcon = divIcon({
  html: manIconMarkup,
  className: 'man-icon',
  iconAnchor: [14, 19],
});

const dotIcon = divIcon({
  html: dotIconMarkup,
  className: 'dot-icon',
  // iconAnchor: [14, 19],
});

function MapMarker({ location, type }) {
  return (
    type === 'user'
      ? (
        <Marker position={location} icon={manIcon}>
          <Popup>
            <span>Your location.</span>
          </Popup>
        </Marker>
      )
      : (
        <Marker position={location} icon={dotIcon}>
          <Popup>
            <span>Brewery location.</span>
          </Popup>
        </Marker>
      )
  );
}

MapMarker.propTypes = {
  location: PropTypes.object,
};

export default MapMarker;
