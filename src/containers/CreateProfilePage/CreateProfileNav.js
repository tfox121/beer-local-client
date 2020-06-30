import React from 'react';
import { Grid, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CreateProfileNavStyle from './CreateProfileNavStyle';

import { PROFILE_CREATION_STAGES } from '../../utils/constants';

const CreateProfileNav = ({
  profileStage,
  backClickHandler,
  forwardClickHandler,
  handleSubmit,
}) => {
  const backButton = () => (
    <Grid.Column width="2" as="button" onClick={backClickHandler}>
      <Icon name="angle left" size="big" />
      Back
    </Grid.Column>
  );

  const forwardButton = () => (
    <Grid.Column width="2" as="button" onClick={forwardClickHandler}>
      <Icon name="angle right" size="big" />
      Continue
    </Grid.Column>
  );

  const tickButton = () => (
    <Grid.Column width="2" as="button" onClick={handleSubmit}>
      <Icon name="check" size="large" />
      Complete
    </Grid.Column>
  );

  switch (profileStage) {
    case 0:
      return null;
    case PROFILE_CREATION_STAGES:
      return (
        <CreateProfileNavStyle>
          <Grid textAlign="center">
            <Grid.Row>
              {backButton()}
              <Grid.Column width="12" />
              {tickButton()}
            </Grid.Row>
          </Grid>
        </CreateProfileNavStyle>
      );
    default:
      return (
        <CreateProfileNavStyle>
          <Grid textAlign="center">
            <Grid.Row>
              {backButton()}
              <Grid.Column width="12" />
              {forwardButton()}
            </Grid.Row>
          </Grid>
        </CreateProfileNavStyle>
      );
  }
};

CreateProfileNav.propTypes = {
  profileStage: PropTypes.number,
  handleSubmit: PropTypes.func,
  backClickHandler: PropTypes.func,
  forwardClickHandler: PropTypes.func,
};

export default CreateProfileNav;
