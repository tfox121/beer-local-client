/**
 *
 * DistributionAreaDisplay
 *
 */

import React, { memo } from 'react';
import { FeatureGroup } from 'react-leaflet';
import PropTypes from 'prop-types';

const DistributionAreaDisplay = ({ distributionAreas }) => {
  const onFeatureGroupReady = reactFGref => {
    setTimeout(() => {
      if (reactFGref) {
        if (
          distributionAreas &&
          distributionAreas.features &&
          distributionAreas.features.length > 0
        ) {
          // eslint-disable-next-line global-require
          const L = require('leaflet');

          const customGeoJSON = new L.GeoJSON(distributionAreas);

          const leafletFG = reactFGref.leafletElement;

          if (leafletFG) {
            leafletFG.eachLayer(layer => {
              leafletFG.removeLayer(layer);
            });

            customGeoJSON.eachLayer(layer => {
              leafletFG.addLayer(layer);
            });
          }
        }
      }
    }, 0);
  };

  return (
    <FeatureGroup
      ref={reactFGref => {
        onFeatureGroupReady(reactFGref);
      }}
    />
  );
};

DistributionAreaDisplay.propTypes = {
  distributionAreas: PropTypes.object,
};

export default memo(DistributionAreaDisplay);
