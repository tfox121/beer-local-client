import React, { useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Image, Button, Modal, Form,
} from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from 'react-semantic-ui-range';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import { useInjectSaga } from '../../utils/injectSaga';
// import { useInjectReducer } from '../../utils/injectReducer';
import { makeSelectProducerProfile, makeSelectUser, makeSelectUpdatingUser } from './selectors';
// import saga from './saga';
import dataURItoBlob from '../../utils/dataURItoBlob';
import { updateUser } from '../App/actions';
import EditProfileStyle from './EditProfileStyle';
import { updateProfile } from '../ProducerProfilePage/actions';
// import { fetchUser } from '../App/actions';

const ProfileEditModal = ({
  producerProfile, user, userUpdate, profileUpdate, userUpdating,
}) => {
  // useInjectReducer({ key: 'global', reducer });
  // useInjectSaga({ key: 'profileEditModal', saga });

  const [userFormValues, setUserFormValues] = useState({ businessName: '', website: '' });
  const [producerFormValues, setProducerFormValues] = useState({ salesEmail: '', salesContactNumber: '', intro: '' });
  const [bannerPicture, setBannerPicture] = useState({});
  const [profilePicture, setProfilePicture] = useState({});
  const [imageResizeModalOpen, setImageResizeModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const bannerPictureRef = createRef();
  const profilePictureRef = createRef();
  const editorRef = createRef();

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
    businessName, website, avatarSource, bannerSource, salesEmail, salesContactNumber, intro,
  } = user;

  useEffect(() => {
    if (Object.keys(user).length) {
      setUserFormValues({
        businessName, website,
      });
      setProducerFormValues({
        salesEmail, salesContactNumber, intro,
      });
    }
  }, [user, businessName, website, avatarSource, bannerSource]);

  useEffect(() => {
    if (!profilePicture && !bannerPicture) {
      setImageResizeModalOpen(false);
    } else if (profilePicture.name || bannerPicture.name) {
      setImageResizeModalOpen(true);
    }
  }, [profilePicture, bannerPicture]);

  const handleUserInfoChange = (e, { name, value }) => {
    setUserFormValues({ ...userFormValues, [name]: value });
  };

  const handleProducerInfoChange = (e, { name, value }) => {
    setProducerFormValues({ ...producerFormValues, [name]: value });
  };

  const handleApply = () => {
    if (editorRef.current) {
      const canvasScaled = editorRef.current.getImageScaledToCanvas();
      if (profilePicture.name) {
        setProfilePicture({});
        setUserFormValues({ ...userFormValues, avatarSource: canvasScaled.toDataURL() });
      }
      if (bannerPicture.name) {
        setUserFormValues({ ...userFormValues, bannerSource: canvasScaled.toDataURL() });
        setBannerPicture({});
      }
    }
    setImageResizeModalOpen(false);
  };

  const handleModalClose = () => {
    setBannerPicture({});
    setProfilePicture({});
    setImageResizeModalOpen(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(userFormValues).forEach((formKey) => {
      if (formKey === 'avatarSource' || formKey === 'bannerSource') {
        formData.set(formKey, dataURItoBlob(userFormValues[formKey]));
      } else {
        formData.set(formKey, userFormValues[formKey]);
      }
    });
    userUpdate(formData);
    profileUpdate({ ...producerFormValues, ...userFormValues });
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
                    <Image className="banner-image" src={userFormValues.bannerSource || bannerSource || '/images/banners/blank-banner.png'} centered />
                    <Button inverted style={{ zIndex: 2 }} circular basic className="image-button" icon="camera" onClick={() => bannerPictureRef.current.click()} />
                    <input
                      id="bannerPictureUpload"
                      ref={bannerPictureRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                      hidden
                      onChange={(e) => setBannerPicture(e.target.files[0])}
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
                      <Image className="profile-image" src={userFormValues.avatarSource || avatarSource || '/images/avatars/blank-avatar.webp'} size="small" bordered centered circular />
                      <Button inverted circular basic className="image-button" icon="camera" onClick={() => profilePictureRef.current.click()} />
                      <input
                        id="profilePictureUpload"
                        ref={profilePictureRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                        hidden
                        onChange={(e) => setProfilePicture(e.target.files[0])}
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
                value={userFormValues.businessName}
                onChange={handleUserInfoChange}
              />
              <Form.Input
                label="Website"
                name="website"
                value={userFormValues.website}
                type="url"
                onChange={handleUserInfoChange}
              />
              <Form.Input
                label="Sales contact number"
                name="salesContactNumber"
                value={producerFormValues.salesContactNumber}
                type="tel"
                onChange={handleProducerInfoChange}
              />
              <Form.Input
                label="Sales email"
                name="salesEmail"
                value={producerFormValues.salesEmail}
                type="email"
                onChange={handleProducerInfoChange}
              />
              <Form.TextArea
                label="Intro"
                name="intro"
                value={producerFormValues.intro}
                onChange={handleProducerInfoChange}
              />
            </Form>
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
              image={profilePicture.name ? profilePicture : bannerPicture.name ? bannerPicture : undefined}
              width={profilePicture.name ? 300 : 750}
              height={profilePicture.name ? 300 : 250}
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
