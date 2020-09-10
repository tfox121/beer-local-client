/**
 *
 * MapMarker
 *
 */

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Icon } from 'semantic-ui-react';

const blueMarkerIconMarkup = renderToStaticMarkup(<Icon size="big" color="blue" name="map marker alternate" />);
const redMarkerIconMarkup = renderToStaticMarkup(<Icon size="big" color="red" name="map marker alternate" />);
const manIconMarkup = renderToStaticMarkup(<Icon size="big" name="street view" />);
const dotIconMarkup = renderToStaticMarkup(<Icon name="dot circle outline" color="blue" />);

const blueMarkerIcon = divIcon({
  html: blueMarkerIconMarkup,
  className: 'blue-marker-icon',
  iconAnchor: [14, 19],
});

const redMarkerIcon = divIcon({
  html: redMarkerIconMarkup,
  className: 'red-marker-icon',
  iconAnchor: [14, 19],
});

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

function MapMarker({ location, type, name }) {
  switch (type) {
    case ('customer'):
      return (
        <Marker position={location} icon={blueMarkerIcon}>
          <Popup>
            <span>{name}</span>
          </Popup>
        </Marker>
      );
    case ('not-customer'):
      return (
        <Marker position={location} icon={redMarkerIcon}>
          <Popup>
            <span>{name}</span>
          </Popup>
        </Marker>
      );
    case ('user'):
      return (
        <Marker position={location} icon={manIcon}>
          <Popup>
            <span>Your location.</span>
          </Popup>
        </Marker>
      );
    default:
      return (
        <Marker position={location} icon={dotIcon}>
          <Popup>
            <span>Brewery location.</span>
          </Popup>
        </Marker>
      );
  }
}

MapMarker.propTypes = {
  location: PropTypes.object,
  type: PropTypes.string,
  name: PropTypes.string,
};

export default MapMarker;
