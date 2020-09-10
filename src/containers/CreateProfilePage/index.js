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
import PhoneNumber from 'awesome-phonenumber';
import { useAuth0 } from '@auth0/auth0-react';

import { Helmet } from 'react-helmet';
// import messages from './messages';
import { saveUser } from '../App/actions';

import CreateProfileNav from './CreateProfileNav';
import BusinessTypeSelection from './BusinessTypeSelection';
import ProducerForm from './ProducerForm';
import SelectDistroAreasForm from './SelectDistroAreasForm';
import RetailerForm from './RetailerForm';
import CommsOptionsForm from './CommsOptionsForm';
import PageWrapper from '../../components/PageWrapper';
import { getPresignedRoute, imageToBucket } from '../../utils/bucket';
import getImageUrl from '../../utils/getImageUrl';
import { makeSelectSavingUser } from '../App/selectors';

export function CreateProfilePage({ userSave, savingUser }) {
  // useInjectReducer({ key: 'createProfilePage', reducer });
  // useInjectSaga({ key: 'createProfilePage', saga });

  const { user } = useAuth0();

  const formTemplate = {
    type: '',
    businessName: '',
    primaryContactName: '',
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
    deliveryInstruction: '',
    contactOptions: {},
  };

  const [avatarSaved, setAvatarSaved] = useState(undefined);
  const [avatarRoute, setAvatarRoute] = useState({});
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

  useEffect(() => {
    if (avatarSaved) {
      const setAvatarRouteAsync = async () => {
        setAvatarRoute(await getPresignedRoute('avatar'));
      };
      setAvatarRouteAsync();
    }
    return () => {
      setAvatarRoute({});
    };
  }, [avatarSaved]);

  useEffect(() => {
    if (localStorage.businessName) {
      setFormValues((prevFormValues) => ({ ...prevFormValues, businessName: localStorage.businessName }));
    }
    if (localStorage.businessType) {
      setFormValues((prevFormValues) => ({ ...prevFormValues, type: localStorage.businessType }));
      setProfileStage(1);
    }
  }, [localStorage]);

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

  const backClickHandler = () => {
    setProfileStage(profileStage - 1);
  };

  const forwardClickHandler = () => {
    const errors = {};

    if (formValues.type === 'retailer') {
      const puchasingNumber = new PhoneNumber(formValues.purchasingContactNumber, 'GB');
      if (!puchasingNumber.isValid()) {
        errors.purchasingContactNumber = 'This is not a valid phone number';
      }
      if (!formValues.purchasingEmail) {
        errors.purchasingEmail = 'This field is required';
      }
      if (!formValues.primaryContactName) {
        errors.primaryContactName = 'This field is required';
      }
    } else if (formValues.type === 'producer') {
      const salesNumber = new PhoneNumber(formValues.salesContactNumber, 'GB');
      if (!salesNumber.isValid()) {
        errors.salesContactNumber = 'This is not a valid phone number';
      }
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

  const handleSubmit = async () => {
    const errors = {};

    if (formValues.type === 'producer') {
      if (formValues.distributionAreas && (!formValues.distributionAreas.features || !formValues.distributionAreas.features.length)) {
        errors.distributionAreas = 'You need to save at least one distribution area. If you have already drawn a shape, make sure you click \'Finish\' in order to proceed';
      }
    }

    if (!Object.keys(errors).length) {
      let avatarSource;
      if (avatarSaved) {
        const response = await imageToBucket(avatarRoute, avatarSaved);
        if (response.status === 204) {
          avatarSource = getImageUrl(user.sub, 'avatar');
        }
      }
      console.log('SAVING', { ...formValues, avatarSource });
      userSave({ ...formValues, avatarSource });
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <>
      <Helmet>
        <title>BeerLocal - Create your profile</title>
        <meta name="description" content="Profile creation form" />
      </Helmet>
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
            avatarSaved={avatarSaved}
            setAvatarSaved={setAvatarSaved}
          />
          <SelectDistroAreasForm
            formValues={formValues}
            setFormValues={setFormValues}
            profileStage={profileStage}
            mapCentre={mapCentre}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
          />
          <RetailerForm
            formValues={formValues}
            setFormValues={setFormValues}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            profileStage={profileStage}
            mapCentre={mapCentre}
            setMapCentre={setMapCentre}
            avatarSaved={avatarSaved}
            setAvatarSaved={setAvatarSaved}
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
    </>
  );
}

CreateProfilePage.propTypes = {
  userSave: PropTypes.func,
  savingUser: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  savingUser: makeSelectSavingUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    userSave: (profileData) => dispatch(saveUser(profileData)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CreateProfilePage);
