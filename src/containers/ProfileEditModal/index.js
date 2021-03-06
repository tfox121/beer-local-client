/* eslint-disable no-nested-ternary */
import React, {
  useState, createRef, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Image, Button, Modal, Form, Header, Message,
} from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from 'react-semantic-ui-range';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PhoneNumber from 'awesome-phonenumber';

// import { useInjectSaga } from '../../utils/injectSaga';
// import { useInjectReducer } from '../../utils/injectReducer';
import NumberFormat from 'react-number-format';
import Geosuggest from 'react-geosuggest';
import L from 'leaflet';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { makeSelectProducerProfile, makeSelectUser, makeSelectUpdatingUser } from './selectors';
// import saga from './saga';
import ayt from '../../utils/phoneNumberValidation';
import { updateUser } from '../App/actions';
import EditProfileStyle from './EditProfileStyle';
import { updateProfile } from '../ProducerProfilePage/actions';
import { getPresignedRoute, imageToBucket } from '../../utils/bucket';
import getImageUrl from '../../utils/getImageUrl';
import SuggestBlockStyle from '../CreateProfilePage/SuggestBlockStyle';
import DistroMapStyle from '../CreateProfilePage/DistroMapStyle';
import MapMarker from '../../components/MapMarker';
import { MAP_TILE_PROVIDER_URL } from '../../utils/constants';
// import { fetchUser } from '../App/actions';

const ProfileEditModal = ({
  producerProfile, user, userUpdate, profileUpdate, userUpdating, profileEditModalOpen, setProfileEditModalOpen,
}) => {
  // useInjectReducer({ key: 'global', reducer });
  // useInjectSaga({ key: 'profileEditModal', saga });

  const [userFormValues, setUserFormValues] = useState({});
  const [producerFormValues, setProducerFormValues] = useState({
    profileOptions: { activeModules: [], distantPurchasingConditions: { minSped: undefined } },
  });
  const [formErrors, setFormErrors] = useState({});
  const [banner, setBanner] = useState({});
  const [avatar, setAvatar] = useState({});
  const [bannerSaved, setBannerSaved] = useState(undefined);
  const [avatarSaved, setAvatarSaved] = useState(undefined);
  const [bannerRoute, setBannerRoute] = useState({});
  const [avatarRoute, setAvatarRoute] = useState({});
  const [savedPolygons, setSavedPolygons] = useState({});
  const [imageResizeModalOpen, setImageResizeModalOpen] = useState(false);
  const [unformattedTel, setUnformattedTel] = useState(user.salesContactNumber);
  const [zoom, setZoom] = useState(1);

  const bannerRef = createRef();
  const avatarRef = createRef();
  const editorRef = createRef();
  const geosuggestEl = useRef(null);

  const sliderSettings = {
    start: 1,
    min: 0.5,
    max: 3,
    step: 0.05,
    onChange: (value) => {
      setZoom(value);
    },
  };

  const {
    businessName, website, primaryContactName, salesEmail, salesContactNumber, address, location, distributionAreas, intro, profileOptions, bannerSource, avatarSource,
  } = user;

  const handleUserInfoChange = (e, { name, value }) => {
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors({ ...newErrors });
    }
    setUserFormValues({ ...userFormValues, [name]: value });
  };

  const handleProducerInfoChange = (e, { name, value }) => {
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors({ ...newErrors });
    }
    setProducerFormValues({ ...producerFormValues, [name]: value });
  };

  useEffect(() => {
    if (formErrors.salesContactNumber) {
      const newErrors = { ...formErrors };
      delete newErrors.salesContactNumber;
      setFormErrors({ ...newErrors });
    }
    if (unformattedTel === '') {
      ayt.reset(null);
      setProducerFormValues({ ...producerFormValues, salesContactNumber: '' });
    } else {
      ayt.reset(unformattedTel);
      setProducerFormValues({ ...producerFormValues, salesContactNumber: ayt.number() });
    }
  }, [unformattedTel, formErrors, setProducerFormValues]);

  useEffect(() => {
    if (Object.keys(user).length) {
      setProducerFormValues({ profileOptions });
    }
  }, [user, profileOptions]);

  useEffect(() => {
    if (distributionAreas) {
      console.log('SETTING POLYS');
      setSavedPolygons({ ...distributionAreas });
    }
  }, [distributionAreas]);

  // useEffect(() => {
  //   if (profileOptions.distantPurchasing) {
  //     setProducerFormValues({ ...producerFormValues, profileOptions: { ...producerFormValues.profileOptions, distantPurchasingConditions: {} } });
  //   }
  // }, [profileOptions.distantPurchasing]);

  useEffect(() => {
    if (!avatar && !banner) {
      setImageResizeModalOpen(false);
    } else if (avatar.name || banner.name) {
      setImageResizeModalOpen(true);
    }
  }, [avatar, banner]);

  useEffect(() => {
    if (bannerSaved) {
      const setBannerRouteAsync = async () => {
        setBannerRoute(await getPresignedRoute('banner'));
      };
      setBannerRouteAsync();
    }
    if (avatarSaved) {
      const setAvatarRouteAsync = async () => {
        setAvatarRoute(await getPresignedRoute('avatar'));
      };
      setAvatarRouteAsync();
    }
    return () => {
      setBannerRoute({});
      setAvatarRoute({});
    };
  }, [bannerSaved, avatarSaved]);

  const handleApply = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      if (avatar.name) {
        setAvatar({});
        setAvatarSaved(canvasScaled.toDataURL());
      }
      if (banner.name) {
        setBanner({});
        setBannerSaved(canvasScaled.toDataURL());
      }
    }
    setImageResizeModalOpen(false);
  };

  const handleModalClose = () => {
    setBanner({});
    setAvatar({});
    setImageResizeModalOpen(false);
  };

  const handleModuleToggle = (e, { name, checked }) => {
    let activeModules = [...producerFormValues.profileOptions.activeModules];
    if (checked) {
      activeModules.push(name);
    } else {
      activeModules = activeModules.filter((moduleName) => moduleName !== name);
    }
    setProducerFormValues({ ...producerFormValues, profileOptions: { ...producerFormValues.profileOptions, activeModules } });
  };

  const handleProfileOptionsToggle = (e, { name, checked }) => {
    const newErrors = { ...formErrors };
    delete newErrors[name];
    if (name === 'distantPurchasing') {
      delete newErrors.minSpend;
    }
    setFormErrors({ ...newErrors });
    setProducerFormValues({ ...producerFormValues, profileOptions: { ...producerFormValues.profileOptions, [name]: checked } });
  };

  const handleDistantPurchasingOptionsChange = (e, { name, value }) => {
    const newErrors = { ...formErrors };
    delete newErrors[name];
    setFormErrors({ ...newErrors });
    setProducerFormValues({ ...producerFormValues, profileOptions: { ...producerFormValues.profileOptions, distantPurchasingConditions: { [name]: value } } });
  };

  const handleSuggestSelect = (suggestion) => {
    if (suggestion) {
      const newErrors = { ...formErrors };
      delete newErrors.location;
      setFormErrors({ ...newErrors });
      setUserFormValues({ ...userFormValues, location: suggestion.location, address: suggestion.gmaps.formatted_address });
    }
  };

  let editableFG = null;

  const onFeatureGroupReady = (reactFGref) => {
    if (reactFGref) {
      // if (savedPolygons.features && savedPolygons.features.length > 0) {
      const customGeoJSON = new L.GeoJSON(savedPolygons);

      const leafletFG = reactFGref.leafletElement;

      leafletFG.eachLayer((layer) => {
        leafletFG.removeLayer(layer);
      });

      customGeoJSON.eachLayer((layer) => {
        leafletFG.addLayer(layer);
      });
      // }
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
    setSavedPolygons(geojsonData);
  };

  const onEdited = () => onChange();

  const onCreated = () => onChange();

  const onDeleted = () => onChange();

  const handleSubmit = async () => {
    const errors = {};

    if (producerFormValues.salesContactNumber && !new PhoneNumber(producerFormValues.salesContactNumber, 'GB').isValid()) {
      errors.salesContactNumber = 'This is not a valid phone number';
    }
    if (!producerFormValues.salesEmail === '') {
      errors.salesEmail = 'This field is required';
    }
    if (userFormValues.businessName === '') {
      errors.businessName = 'This field is required';
    }
    if (producerFormValues.profileOptions.distantPurchasing && (!producerFormValues.profileOptions.distantPurchasingConditions || !producerFormValues.profileOptions.distantPurchasingConditions.minSpend)) {
      errors.minSpend = 'If you wish to enable ordering from outside your distribution area, you must enter a minimum order value.';
    }
    if (savedPolygons && (!savedPolygons.features || !savedPolygons.features.length)) {
      errors.distributionAreas = 'You need to save at least one distribution area. If you have already drawn a shape, make sure you click \'Finish\' in order to proceed';
    }
    if (!Object.keys(errors).length) {
      const imagesObj = {};
      if (bannerSaved) {
        const response = await imageToBucket(bannerRoute, bannerSaved);
        if (response.status === 204) {
          imagesObj.bannerSource = getImageUrl(user.sub, 'banner');
        }
      }
      if (avatarSaved) {
        const response = await imageToBucket(avatarRoute, avatarSaved);
        if (response.status === 204) {
          imagesObj.avatarSource = getImageUrl(user.sub, 'avatar');
        }
      }
      userUpdate({ ...userFormValues, ...imagesObj });
      profileUpdate({ ...producerFormValues, ...userFormValues, distributionAreas: savedPolygons });
      setTimeout(() => {
        if (bannerSaved || avatarSaved) {
          window.location.reload();
          return;
        }
        setProfileEditModalOpen(false);
      }, 1500);
    } else {
      setFormErrors(errors);
    }
  };

  if (!producerProfile) {
    return null;
  }

  return (
    <>
      <Modal.Content>
        <EditProfileStyle>
          <div className="image-stack">
            <div className="image-stack__item image-stack__item--bottom">
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="button-image-container">
                    <Image className="banner-image" src={bannerSaved || bannerSource || '/images/banners/blank-banner.png'} centered />
                    <Button inverted style={{ zIndex: 2 }} circular basic className="image-button" icon="camera" onClick={() => bannerRef.current.click()} />
                    <input
                      id="bannerUpload"
                      ref={bannerRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                      hidden
                      onChange={(e) => setBanner(e.target.files[0])}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </div>
            <div className="image-stack__item image-stack__item--top">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <div className="button-image-container">
                      <Image className="profile-image" src={avatarSaved || avatarSource || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular />
                      <Button inverted circular basic className="image-button" icon="camera" onClick={() => avatarRef.current.click()} />
                      <input
                        id="avatarUpload"
                        ref={avatarRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                        hidden
                        onChange={(e) => setAvatar(e.target.files[0])}
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={7} />
                  <Grid.Column className="profile-buttons" width={5} textAlign="right" verticalAlign="middle">
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
          <Modal.Description>
            <Form>
              <Form.Input
                label="Brewery name"
                name="businessName"
                value={userFormValues.businessName || businessName}
                required
                onChange={handleUserInfoChange}
                error={
                  formErrors.businessName && {
                    content: formErrors.businessName,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Sales contact name"
                name="primaryContactName"
                value={userFormValues.primaryContactName || primaryContactName}
                required
                onChange={handleUserInfoChange}
                error={
                  formErrors.primaryContactName && {
                    content: formErrors.primaryContactName,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Sales email address"
                name="salesEmail"
                value={producerFormValues.salesEmail || salesEmail}
                required
                type="email"
                onChange={handleProducerInfoChange}
                error={
                  formErrors.salesEmail && {
                    content: formErrors.salesEmail,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Sales contact number"
                name="salesContactNumber"
                value={producerFormValues.salesContactNumber || new PhoneNumber(salesContactNumber, 'GB').getNumber('national')}
                type="tel"
                onChange={(e) => setUnformattedTel(e.target.value)}
                error={
                  formErrors.salesContactNumber && {
                    content: formErrors.salesContactNumber,
                    pointing: 'above',
                  }
                }
              />
              <Form.Input
                label="Website"
                name="website"
                value={userFormValues.website || website}
                type="url"
                onChange={handleUserInfoChange}
              />
              <Form.TextArea
                label="Intro"
                name="intro"
                value={producerFormValues.intro || intro}
                onChange={handleProducerInfoChange}
              />

              <div
                className={`${formErrors.location && 'error'} required field`}
              >
                <SuggestBlockStyle>
                  <Geosuggest
                    ref={geosuggestEl}
                    label="Location"
                    id="breweryLocation"
                    initialValue={userFormValues.address || address}
                    // eslint-disable-next-line no-undef
                    location={
                      // eslint-disable-next-line no-undef
                      new google.maps.LatLng(location[0], location[1])
                    }
                    radius="1500"
                    minlegnth="3"
                    country="gb"
                    onSuggestSelect={handleSuggestSelect}
                    onBlur={() => geosuggestEl.current.selectSuggest()}
                    required
                    autoActivateFirstSuggest
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
              {savedPolygons && (
                <DistroMapStyle>
                  <Map center={userFormValues.location || location} zoom={10} zoomControl={false}>
                    <TileLayer
                      url={MAP_TILE_PROVIDER_URL}
                    />
                    <MapMarker location={userFormValues.location || location} />
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
              )}
              <Header as="h4">
                Profile Modules
              </Header>
              <Form.Group>
                <Form.Checkbox checked={producerFormValues.profileOptions.activeModules.includes('availability')} onClick={handleModuleToggle} toggle label="Availability" name="availability" />
                <Form.Checkbox checked={producerFormValues.profileOptions.activeModules.includes('promotions')} onClick={handleModuleToggle} toggle label="Promotions" name="promotions" />
                <Form.Checkbox checked={producerFormValues.profileOptions.activeModules.includes('blog')} onClick={handleModuleToggle} toggle label="News" name="blog" />
              </Form.Group>
              <Header as="h4">
                Allow orders from beyond distribution area
              </Header>
              <div
                className={`${formErrors.minSpend && 'error'} required field`}
              >
                <Form.Group style={{ alignItems: 'center', height: '2em' }}>
                  <Form.Checkbox checked={producerFormValues.profileOptions.distantPurchasing} onClick={handleProfileOptionsToggle} toggle label="Allow" name="distantPurchasing" />
                  {producerFormValues.profileOptions.distantPurchasing && (
                    <NumberFormat
                      style={{ width: '50%', marginLeft: '1em' }}
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                      placeholder="For orders more than..."
                      prefix="£"
                      onValueChange={(values) => handleDistantPurchasingOptionsChange(null, { name: 'minSpend', value: values.floatValue })}
                      allowNegative={false}
                      value={(producerFormValues.profileOptions.distantPurchasingConditions && producerFormValues.profileOptions.distantPurchasingConditions.minSpend) || undefined}
                    />
                  )}
                </Form.Group>
                {formErrors.minSpend && (
                  <div
                    className="ui above pointing prompt label"
                    role="alert"
                    aria-atomic="true"
                  >
                    {formErrors.minSpend}
                  </div>
                )}
              </div>
            </Form>
            {formErrors.distributionAreas && (
              <Message warning>
                <Message.Header>Error</Message.Header>
                <p>{formErrors && formErrors.distributionAreas}</p>
              </Message>
            )}
          </Modal.Description>
          <Modal className="image-resizer" open={imageResizeModalOpen} onClose={handleModalClose}>
            <Modal.Header>
              <Button floated="left" basic icon="left arrow" onClick={() => setImageResizeModalOpen(false)} />
              Edit picture
              {' '}
              <Button primary floated="right" content="Apply" onClick={handleApply} />
            </Modal.Header>
            <AvatarEditor
              ref={editorRef}
              image={avatar.name ? avatar : banner.name ? banner : undefined}
              width={avatar.name ? 300 : 750}
              height={avatar.name ? 300 : 250}
              border={25}
              scale={zoom}
              color={[255, 255, 255, 0.6]}
            />
            <Modal.Content>
              <Slider value={zoom} color="blue" settings={sliderSettings} />
            </Modal.Content>
          </Modal>
        </EditProfileStyle>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          content="Save"
          onClick={handleSubmit}
          loading={userUpdating}
        />
      </Modal.Actions>
    </>
  );
};

ProfileEditModal.propTypes = {
  producerProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userUpdating: PropTypes.bool,
  userUpdate: PropTypes.func,
  profileUpdate: PropTypes.func,
  setProfileEditModalOpen: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  user: makeSelectUser(),
  userUpdating: makeSelectUpdatingUser(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    userUpdate: (updateObj) => dispatch(updateUser(updateObj, location.pathname)),
    profileUpdate: (updateObj) => dispatch(updateProfile(updateObj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProfileEditModal);
