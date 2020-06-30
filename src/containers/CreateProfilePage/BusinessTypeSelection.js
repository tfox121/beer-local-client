import React, { useEffect, useState } from 'react';
import { Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const BusinessTypeSelection = ({
  profileStage,
  formValues,
  setFormValues,
  setProfileStage,
}) => {
  const [visible, setVisible] = useState(true);
  const handleProducerClick = () => {
    setFormValues({ ...formValues, type: 'producer' });
    setProfileStage(1);
  };

  const handleRetailerClick = () => {
    setFormValues({ ...formValues, type: 'retailer' });
    setProfileStage(1);
  };

  useEffect(() => {
    if (profileStage === 0) {
      setVisible(true);
      return;
    }
    setVisible(false);
  }, [profileStage]);

  return (
    visible && (
      <Grid columns={2} divided centered>
        <Grid.Row>
          <Grid.Column
            className="typeSelector producer"
            as="button"
            width={7}
            textAlign="center"
            onClick={handleProducerClick}
          >
            <Header as="h1">Producer</Header>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column
            className="typeSelector retailer"
            as="button"
            width={7}
            textAlign="center"
            onClick={handleRetailerClick}
          >
            <Header as="h1">Retailer</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  );
};

BusinessTypeSelection.propTypes = {
  profileStage: PropTypes.number,
  formValues: PropTypes.object,
  setFormValues: PropTypes.func,
  setProfileStage: PropTypes.func,
};

export default BusinessTypeSelection;
