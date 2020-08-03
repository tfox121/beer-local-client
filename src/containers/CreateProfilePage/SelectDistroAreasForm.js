/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Transition, Message } from 'semantic-ui-react';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import PropTypes from 'prop-types';

import MapMarker from '../../components/MapMarker';
import DistroMapStyle from './DistroMapStyle';
import { MAP_TILE_PROVIDER_URL } from '../../utils/constants';

const SelectDistroAreasForm = ({
  formValues,
  setFormValues,
  formErrors,
  setFormErrors,
  profileStage,
  mapCentre,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (profileStage === 2 && formValues.type === 'producer') {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [formValues.type, profileStage]);

  let editableFG = null;

  const onFeatureGroupReady = (reactFGref) => {
    if (reactFGref) {
      editableFG = reactFGref;
    }
  };

  const onChange = () => {
    if (!editableFG || !onChange) {
      return;
    }
    const geojsonData = editableFG.leafletElement.toGeoJSON();

    const newErrors = { ...formErrors };
    delete newErrors.distributionAreas;
    setFormErrors({ ...newErrors });
    setFormValues({ ...formValues, distributionAreas: geojsonData });
  };

  const onEdited = () => {
    onChange();
  };

  const onCreated = (e) => {
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
                url={MAP_TILE_PROVIDER_URL}
              />
              <MapMarker location={formValues.location} />
              <FeatureGroup
                ref={(reactFGref) => {
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
          {formErrors.distributionAreas && (
            <Message warning>
              <Message.Header>Error</Message.Header>
              <p>{formErrors.distributionAreas}</p>
            </Message>
          )}
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
  formErrors: PropTypes.object,
};

export default SelectDistroAreasForm;
