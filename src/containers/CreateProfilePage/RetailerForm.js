import React, { useEffect, useState } from 'react';
import { TileLayer, Map } from 'react-leaflet';
import { Grid, Form } from 'semantic-ui-react';

import Geosuggest from 'react-geosuggest';

import ImageUpload from '../../components/ImageUpload';
import MapMarker from '../../components/MapMarker';
import MarkerMapStyle from './MarkerMapStyle';
import SuggestBlockStyle from './SuggestBlockStyle';

const RetailerForm = ({
  formValues,
  setFormValues,
  formErrors,
  setFormErrors,
  profileStage,
  mapCentre,
  setMapCentre,
}) => {
  const [zoomLevel, setZoomLevel] = useState(5);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (profileStage === 1 && formValues.type === 'retailer') {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [formValues.type, profileStage]);

  useEffect(() => {
    if (formValues.location && formValues.location.lat) {
      setMapCentre([formValues.location.lat, formValues.location.lng]);
      setZoomLevel(15);
    }
  }, [setMapCentre, formValues.location]);

  const handleChange = (e, { name, value }) => {
    const newErrors = { ...formErrors };
    delete newErrors[name];
    setFormErrors({ ...newErrors });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxchange = () => {
    const newErrors = { ...formErrors };
    delete newErrors.terms;
    setFormErrors({ ...newErrors });
    setFormValues({ ...formValues, terms: !formValues.terms });
  };

  const handleSuggestSelect = (suggestion) => {
    if (suggestion) {
      console.log(suggestion);
      const { location, gmaps } = suggestion;
      const newErrors = { ...formErrors };
      delete newErrors.location;
      setFormErrors({ ...newErrors });
      setFormValues({ ...formValues, location, address: gmaps.formatted_address });
    }
  };

  return (
    visible && (
      <Grid centered columns={2}>
        <Grid.Row>
          <Grid.Column width={10}>
            <Form>
              <Form.Input
                label="Premises name"
                name="premisesName"
                value={formValues.premisesName}
                required
                onChange={handleChange}
                error={
                  formErrors.premisesName && {
                    content: formErrors.premisesName,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Purchasing email address"
                name="purchasingEmail"
                type="email"
                value={formValues.purchasingEmail}
                required
                onChange={handleChange}
                error={
                  formErrors.purchasingEmail && {
                    content: formErrors.purchasingEmail,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Purchasing contact number"
                name="purchasingContactNumber"
                type="tel"
                value={formValues.purchasingContactNumber}
                onChange={handleChange}
              />
              <div
                className={`${formErrors.location && 'error'} required field`}
              >
                <SuggestBlockStyle>
                  <Geosuggest
                    label="Location"
                    id="Location"
                    // eslint-disable-next-line no-undef
                    location={
                      // eslint-disable-next-line no-undef
                      new google.maps.LatLng(mapCentre[0], mapCentre[1])
                    }
                    radius="1500"
                    minlegnth="3"
                    country="gb"
                    onSuggestSelect={handleSuggestSelect}
                    required
                  />
                </SuggestBlockStyle>
                {formErrors.location && (
                  <div
                    className="ui pointing above prompt label"
                    role="alert"
                    aria-atomic="true"
                  >
                    This field is required
                  </div>
                )}
              </div>
              <br />
              <Form.Checkbox
                label="I agree to the Terms and Conditions"
                name="terms"
                // value={formValues.terms}
                checked={formValues.terms}
                required
                onChange={handleCheckboxchange}
                error={
                  formErrors.terms && {
                    content: formErrors.terms,
                    pointing: 'right',
                  }
                }
              />
            </Form>
          </Grid.Column>
          <Grid.Column width={6}>
            <ImageUpload
              formValues={formValues}
              setFormValues={setFormValues}
              formErrors={formErrors}
            />
            {formValues.location && formValues.location.lat && (
              <MarkerMapStyle>
                <Map center={mapCentre} zoom={zoomLevel} zoomControl={false}>
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                  />
                  <MapMarker location={formValues.location} />
                </Map>
              </MarkerMapStyle>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  );
};

export default RetailerForm;
