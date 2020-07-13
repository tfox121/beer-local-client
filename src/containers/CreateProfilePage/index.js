/**
 *
 * CreateProfilePage
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Segment, Header, Dimmer, Loader,
} from 'semantic-ui-react';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectCreateProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import { saveProfile } from './actions';

import CreateProfileNav from './CreateProfileNav';
import BusinessTypeSelection from './BusinessTypeSelection';
import ProducerForm from './ProducerForm';
import SelectDistroAreasForm from './SelectDistroAreasForm';
import RetailerForm from './RetailerForm';
import CommsOptionsForm from './CommsOptionsForm';
import PageWrapper from '../../components/PageWrapper';

export function CreateProfilePage({ onSaveProfile, createProfilePage }) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });

  const { savingUser } = createProfilePage;

  const formTemplate = {
    type: '',
    businessName: '',
    location: {},
    address: '',
    avatar: false,
    terms: true,
    pictureFile: undefined,
    pictureFileExt: undefined,
    fileValid: true,
  };

  const producerFormTemplate = {
    salesEmail: '',
    salesContactNumber: '',
    website: '',
    intro: '',
    distributionAreas: {},
  };

  const retailerFormTemplate = {
    purchasingEmail: '',
    purchasingContactNumber: '',
    contactOptions: {},
  };

  const [formValues, setFormValues] = useState(formTemplate);
  const [formErrors, setFormErrors] = useState({});
  const [profileStage, setProfileStage] = useState(0);
  const [mapCentre, setMapCentre] = useState([54.00366, -2.547855]);

  useEffect(() => {
    if (profileStage === 0 && Object.keys(formValues).length !== Object.keys(formTemplate).length) {
      setFormValues(formTemplate);
      setFormErrors({});
    }
  }, [profileStage, formTemplate, formValues]);

  useEffect(() => {
    if (
      formValues.type === 'producer'
      && Object.keys(formValues).length === Object.keys(formTemplate).length
    ) {
      setFormValues({ ...formValues, ...producerFormTemplate });
    }
    if (
      formValues.type === 'retailer'
      && Object.keys(formValues).length === Object.keys(formTemplate).length
    ) {
      setFormValues({ ...formValues, ...retailerFormTemplate });
    }
  }, [formValues, formTemplate, producerFormTemplate, retailerFormTemplate]);

  // useEffect(() => {
  //   console.log('CHECKING');
  //   if (formValues.pictureFile && !formValues.fileValid) {
  //     setFormValues({
  //       ...formValues,
  //       fileValid: !!ACCEPTED_IMAGE_FORMATS[formValues.pictureFile.type],
  //       pictureFileExt: ACCEPTED_IMAGE_FORMATS[formValues.pictureFile.type],
  //     });
  //   }
  // }, [formValues.pictureFile, formValues]);

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(formValues).forEach((formKey) => {
      if (typeof formValues[formKey] === 'object' && formKey !== 'pictureFile') {
        formData.set(formKey, JSON.stringify(formValues[formKey]));
      } else {
        formData.set(formKey, formValues[formKey]);
      }
    });
    console.log('formdata', formData.get('type'));
    onSaveProfile(formData);
  };

  const backClickHandler = () => {
    setProfileStage(profileStage - 1);
  };

  const forwardClickHandler = () => {
    const errors = {};

    if (formValues.type === 'retailer') {
      if (!formValues.purchasingEmail) {
        errors.purchasingEmail = 'This field is required';
      }
    } else if (formValues.type === 'producer') {
      if (!formValues.salesEmail) {
        errors.salesEmail = 'This field is required';
      }
    }
    if (!formValues.businessName) {
      errors.businessName = 'This field is required';
    }
    if (!formValues.terms) {
      errors.terms = 'This field is required';
    }
    if (formValues.location && !formValues.location.lat) {
      errors.location = 'This field is required';
    }
    if (!formValues.fileValid) {
      errors.pictureFile = 'Invalid file type';
    }

    if (!Object.keys(errors).length) {
      setProfileStage(profileStage + 1);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <PageWrapper>
      <Segment basic textAlign="center" className="primary wrapper">
        <Header as="h1">Complete your profile</Header>
        <BusinessTypeSelection
          profileStage={profileStage}
          setProfileStage={setProfileStage}
          formValues={formValues}
          setFormValues={setFormValues}
        />
        <ProducerForm
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          profileStage={profileStage}
          mapCentre={mapCentre}
          setMapCentre={setMapCentre}
        />
        <SelectDistroAreasForm
          formValues={formValues}
          setFormValues={setFormValues}
          profileStage={profileStage}
          mapCentre={mapCentre}
        />
        <RetailerForm
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          profileStage={profileStage}
          mapCentre={mapCentre}
          setMapCentre={setMapCentre}
        />
        <CommsOptionsForm
          formValues={formValues}
          setFormValues={setFormValues}
          profileStage={profileStage}
        />
        <CreateProfileNav
          backClickHandler={backClickHandler}
          forwardClickHandler={forwardClickHandler}
          profileStage={profileStage}
          handleSubmit={handleSubmit}
        />
      </Segment>
      {savingUser && (
        <Dimmer inverted active page>
          <Loader inverted />
        </Dimmer>
      )}
    </PageWrapper>
  );
}

CreateProfilePage.propTypes = {
  onSaveProfile: PropTypes.func,
  createProfilePage: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  createProfilePage: makeSelectCreateProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSaveProfile: (profileData) => dispatch(saveProfile(profileData)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CreateProfilePage);
