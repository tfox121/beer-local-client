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

const newIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/585px-Google_Maps_pin.svg.png',
  iconRetinaUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/585px-Google_Maps_pin.svg.png',
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(60, 75),
  className: 'leaflet-div-icon',
});

const iconMarkup = renderToStaticMarkup(<Icon size="big" name="street view" />);

const customMarkerIcon = divIcon({
  html: iconMarkup,
  className: 'custom-icon',
  iconAnchor: [14, 19],
});

function MapMarker({ location, type }) {
  return (
    type === 'user'
      ? (
        <Marker position={location} icon={customMarkerIcon}>
          <Popup>
            <span>Your location.</span>
          </Popup>
        </Marker>
      )
      : (
        <Marker position={location}>
          <Popup>
            <span>Your location.</span>
          </Popup>
        </Marker>
      )
  );
}

MapMarker.propTypes = {
  location: PropTypes.object,
};

export default MapMarker;
