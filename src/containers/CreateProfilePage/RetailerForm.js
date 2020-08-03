import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { TileLayer, Map } from 'react-leaflet';
import { Grid, Form } from 'semantic-ui-react';
import Geosuggest from 'react-geosuggest';

import ayt from '../../utils/phoneNumberValidation';

import MapMarker from '../../components/MapMarker';
import MarkerMapStyle from './MarkerMapStyle';
import SuggestBlockStyle from './SuggestBlockStyle';
import ImageSelect from './ImageSelect';
import { DELIVERY_INSTRUCTION_CHARACTER_LIMIT, MAP_TILE_PROVIDER_URL } from '../../utils/constants';

const RetailerForm = ({
  formValues,
  setFormValues,
  formErrors,
  setFormErrors,
  profileStage,
  mapCentre,
  setMapCentre,
  avatarSaved,
  setAvatarSaved,
}) => {
  const [zoomLevel, setZoomLevel] = useState(5);
  const [visible, setVisible] = useState(false);
  const [unformattedTel, setUnformattedTel] = useState('');
  const geosuggestEl = useRef(null);

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

  useEffect(() => {
    const newErrors = { ...formErrors };
    delete newErrors.purchasingContactNumber;
    setFormErrors({ ...newErrors });
    if (unformattedTel === '') {
      ayt.reset(null);
      handleChange(null, { name: 'purchasingContactNumber', value: '' });
    } else {
      ayt.reset(unformattedTel);
      handleChange(null, { name: 'purchasingContactNumber', value: ayt.number() });
    }
  }, [unformattedTel]);

  const handleChange = (e, { name, value }) => {
    const newErrors = { ...formErrors };
    delete newErrors[name];
    setFormErrors({ ...newErrors });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCheckboxChange = () => {
    const newErrors = { ...formErrors };
    delete newErrors.terms;
    setFormErrors({ ...newErrors });
    setFormValues({ ...formValues, terms: !formValues.terms });
  };

  const handleSuggestSelect = (suggestion) => {
    if (suggestion) {
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
                name="businessName"
                value={formValues.businessName}
                required
                onChange={handleChange}
                error={
                  formErrors.businessName && {
                    content: formErrors.businessName,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Primary contact name"
                name="primaryContactName"
                value={formValues.primaryContactName}
                required
                onChange={handleChange}
                error={
                  formErrors.primaryContactName && {
                    content: formErrors.primaryContactName,
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
                onChange={(e) => setUnformattedTel(e.target.value)}
                error={
                  formErrors.purchasingContactNumber && {
                    content: formErrors.purchasingContactNumber,
                    pointing: 'above',
                  }
                }
              />
              <div
                className={`${formErrors.location && 'error'} required field`}
              >
                <SuggestBlockStyle>
                  <Geosuggest
                    ref={geosuggestEl}
                    label="Location"
                    id="Location"
                    location={
                      // eslint-disable-next-line no-undef
                      new google.maps.LatLng(mapCentre[0], mapCentre[1])
                    }
                    radius="1500"
                    minlegnth="3"
                    country="gb"
                    onSuggestSelect={handleSuggestSelect}
                    onBlur={() => geosuggestEl.current.selectSuggest()}
                    autoActivateFirstSuggest
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
              <Form.TextArea
                label="Delivery Instruction"
                placeholder="Any delivery restrictions or instructions..."
                value={formValues.deliveryInstruction}
                name="deliveryInstruction"
                onChange={handleChange}
                maxLength={DELIVERY_INSTRUCTION_CHARACTER_LIMIT}
              />
              {!!formValues.deliveryInstruction.length && (
                <p style={{ textAlign: 'right', fontSize: '10px' }}>
                  {formValues.deliveryInstruction.length}
                  /
                  {DELIVERY_INSTRUCTION_CHARACTER_LIMIT}
                </p>
              )}
              <Form.Checkbox
                label="I agree to the Terms and Conditions"
                name="terms"
                // value={formValues.terms}
                checked={formValues.terms}
                required
                onChange={handleCheckboxChange}
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
            <ImageSelect avatarSaved={avatarSaved} setAvatarSaved={setAvatarSaved} />
            {formValues.location && formValues.location.lat && (
              <MarkerMapStyle>
                <Map center={mapCentre} zoom={zoomLevel} zoomControl={false}>
                  <TileLayer
                    url={MAP_TILE_PROVIDER_URL}
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

RetailerForm.propTypes = {
  formValues: PropTypes.object,
  setFormValues: PropTypes.func,
  formErrors: PropTypes.object,
  setFormErrors: PropTypes.func,
  profileStage: PropTypes.number,
  mapCentre: PropTypes.array,
  setMapCentre: PropTypes.func,
  avatarSaved: PropTypes.string,
  setAvatarSaved: PropTypes.func,
};

export default RetailerForm;
