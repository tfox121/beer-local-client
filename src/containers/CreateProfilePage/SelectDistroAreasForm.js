/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Transition } from 'semantic-ui-react';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import PropTypes from 'prop-types';

import MapMarker from '../../components/MapMarker';
import DistroMapStyle from './DistroMapStyle';

const SelectDistroAreasForm = ({
  formValues,
  setFormValues,
  profileStage,
  mapCentre,
}) => {
  const [visible, setVisible] = useState(false);

  console.log(mapCentre);

  useEffect(() => {
    if (profileStage === 2 && formValues.type === 'producer') {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [formValues.type, profileStage]);

  let editableFG = null;

  const onFeatureGroupReady = reactFGref => {
    if (reactFGref) {
      editableFG = reactFGref;
    }
  };

  const onChange = () => {
    if (!editableFG || !onChange) {
      return;
    }

    const geojsonData = editableFG.leafletElement.toGeoJSON();

    setFormValues({ ...formValues, distributionAreas: geojsonData });
  };

  const onEdited = () => {
    onChange();
  };

  const onCreated = e => {
    const type = e.layerType;
    console.log('onCreated: something else created:', type, e);

    onChange();
  };

  const onDeleted = () => {
    onChange();
  };

  return (
    <Transition.Group animation="fade" duration={{ hide: 500, show: 2000 }}>
      {visible && (
        <>
          <p>
            Use the tools at the top right to draw shapes corresponding to the
            areas that you distribute to.
            <br />
            Make sure to complete your shape by clicking the first point again
            or the &quot;Finish&quot; button at the top right.
            <br />
            Hit &quot;Complete&quot; below when you&apos;re done
          </p>
          <DistroMapStyle>
            <Map center={mapCentre} zoom={10} zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
              />
              <MapMarker location={formValues.location} />
              <FeatureGroup
                ref={reactFGref => {
                  onFeatureGroupReady(reactFGref);
                }}
              >
                <EditControl
                  position="topright"
                  onEdited={onEdited}
                  onCreated={onCreated}
                  onDeleted={onDeleted}
                  draw={{
                    rectangle: false,
                    circle: false,
                    circlemarker: false,
                    polyline: false,
                    marker: false,
                    polygon: {
                      allowIntersection: false,
                      drawError: {
                        color: '#e1e100',
                        message:
                          "<strong>Oh snap!<strong> you can't draw that!",
                      },
                      shapeOptions: {
                        color: '#009dd6',
                      },
                    },
                  }}
                />
              </FeatureGroup>
            </Map>
          </DistroMapStyle>
        </>
      )}
    </Transition.Group>
  );
};

SelectDistroAreasForm.propTypes = {
  profileStage: PropTypes.number,
  formValues: PropTypes.object,
  setFormValues: PropTypes.func,
  mapCentre: PropTypes.array,
};

export default SelectDistroAreasForm;
