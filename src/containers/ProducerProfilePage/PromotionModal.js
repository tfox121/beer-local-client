/* eslint-disable no-nested-ternary */
/**
 *
 * PromotionModal
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Modal, Button, Dropdown, Input, Divider,
} from 'semantic-ui-react';

import NumberFormat from 'react-number-format';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { getPrivateRoute } from '../../utils/api';
import promotionCopySelection from '../../utils/promotionCopy';
import { fetchProfile } from './actions';
import reducer from './reducer';
import saga from './saga';

import { makeSelectProducerProfile, makeSelectUser } from './selectors';
import { PACK_SIZES } from '../../utils/constants';
import PromotionModalStyle from './PromotionModalStyle';

const PromotionModal = ({
  producerProfile, userProfile, profileFetch, location,
}) => {
  useInjectReducer({ key: 'producerProfilePage', reducer });
  useInjectSaga({ key: 'producerProfilePage', saga });

  const [modalOpen, setModalOpen] = useState(false);
  const [promotionSelectedValues, setPromotionSelectedValues] = useState({});
  const [availableStock, setAvailableStock] = useState([]);
  const [availablePackageTypes, setAvailablePackageTypes] = useState([]);
  const [conditionsComplete, setConditionsComplete] = useState(false);
  const [discountsComplete, setDiscountsComplete] = useState(false);
  const [promotionSaved, setPromotionSaved] = useState(false);

  useEffect(() => {
    console.log('USER', userProfile);
    if (userProfile && userProfile.stock) {
      setAvailableStock(userProfile.stock
        .filter((stockItem) => stockItem.display === 'Show')
        .map((stockItem) => ({
          key: stockItem.id, value: stockItem.id, text: `${stockItem.name} - ${PACK_SIZES[stockItem.packSize]} - ${stockItem.availability}`,
        })));
      setAvailablePackageTypes(userProfile.stock
        .filter((stockItem) => stockItem.display === 'Show')
        .map((stockItem) => ({
          key: stockItem.packSize, value: stockItem.packSize, text: PACK_SIZES[stockItem.packSize],
        })));
    }
  }, [userProfile]);

  const promotionOptions = [
    {
      key: 'multibuy',
      text: 'Multi-buy',
      value: 'multibuy',
    },
    {
      key: 'minSpend',
      text: 'Minimum spend',
      value: 'minSpend',
    },
  ];

  const typeOptions = [
    {
      key: 'product',
      text: 'Set product',
      value: 'product',
    },
    {
      key: 'packageType',
      text: 'Package type',
      value: 'packageType',
    },
  ];

  const discountTypeOptions = [
    {
      key: 'moneyOff',
      text: 'Money off',
      value: 'moneyOff',
    },
    {
      key: 'percentageOff',
      text: 'Percentage off',
      value: 'percentageOff',
    },
    {
      key: 'freeItems',
      text: 'Free item(s)',
      value: 'freeItems',
    },
  ];

  const handleModalClose = () => {
    setPromotionSelectedValues({});
    setModalOpen(false);
    setPromotionSaved(false);
  };

  const handleChange = (e, { name, value }) => {
    setPromotionSelectedValues({ ...promotionSelectedValues, [name]: value });
  };

  const handleSave = async () => {
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.post('/producer/promotion', promotionSelectedValues);
    setModalOpen(false);
    console.log(response.data);
  };

  return (
    <Modal
      style={{ left: 0, minWidth: '800px' }}
      size="large"
      open={modalOpen}
      onClose={handleModalClose}
      closeIcon
      trigger={<Button primary onClick={() => setModalOpen(true)}>Add Promotion</Button>}
    >
      <Modal.Header>
        Add New Promotion
      </Modal.Header>
      <Modal.Content>
        {!promotionSaved ? (
          <PromotionModalStyle>
            <Dropdown
              placeholder="Condition"
              name="condition"
              selection
              options={promotionOptions}
              onChange={handleChange}
              value={promotionSelectedValues.condition || undefined}
              fluid
              className="condition-dropdown"
            />
            <div>

              {promotionSelectedValues.condition === 'minSpend' && (
                <>
                  If you spend
                  {' '}
                  <NumberFormat
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                    placeholder="£ ####"
                    prefix="£"
                    onValueChange={(values) => { handleChange(null, { name: 'minSpend', value: values.floatValue }); setConditionsComplete(true); }}
                    allowNegative={false}
                    value={promotionSelectedValues.minSpend || undefined}
                    className="spend-input"
                  />
                </>
              )}
              {promotionSelectedValues.condition === 'multibuy' && (
                <>
                  If you buy
                  {' '}
                  <Input name="multibuyQuantity" className="multibuy-quantity" placeholder="Quantity" onChange={handleChange} value={promotionSelectedValues.multibuyQuantity || ''} />
                  {' '}
                  <Dropdown
                    placeholder="Type"
                    name="multibuyType"
                    selection
                    inline
                    options={typeOptions}
                    onChange={handleChange}
                    value={promotionSelectedValues.multibuyType || undefined}
                  />
                  {promotionSelectedValues.multibuyType === 'product' && (
                    <Dropdown
                      placeholder="Product"
                      name="multibuyProduct"
                      selection
                      options={availableStock}
                      onChange={(e, { name, value }) => { handleChange(e, { name, value }); setConditionsComplete(true); }}
                      value={promotionSelectedValues.multibuyProduct || undefined}
                    />
                  )}
                  {promotionSelectedValues.multibuyType === 'packageType' && (
                    <Dropdown
                      placeholder="Package type"
                      name="multibuyPackageType"
                      selection
                      options={availablePackageTypes}
                      onChange={(e, { name, value }) => { handleChange(e, { name, value }); setConditionsComplete(true); }}
                      value={promotionSelectedValues.multibuyPackageType || undefined}
                    />
                  )}
                </>
              )}
            </div>
            <Divider />
            <Dropdown
              placeholder="Discount type"
              name="discountType"
              selection
              options={discountTypeOptions}
              onChange={handleChange}
              value={promotionSelectedValues.discountType || undefined}
              fluid
              className="discount-dropdown"
            />
            <Divider />

            {promotionSelectedValues.discountType === 'moneyOff' && (
              <>
                You will get
                {' '}
                <NumberFormat
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                  placeholder="£ ####"
                  prefix="£"
                  onValueChange={(values) => { handleChange(null, { name: 'moneyOff', value: values.floatValue }); setDiscountsComplete(true); }}
                  allowNegative={false}
                  value={promotionSelectedValues.moneyOff || undefined}
                  className="discount-value-input"
                />
                {' '}
                off the total order.
              </>
            )}
            {promotionSelectedValues.discountType === 'percentageOff' && (
              <>
                You will get
                {' '}
                <NumberFormat
                  decimalScale={1}
                  fixedDecimalScale
                  placeholder="%"
                  suffix="%"
                  onValueChange={(values) => { handleChange(null, { name: 'percentageOff', value: values.floatValue }); setDiscountsComplete(true); }}
                  allowNegative={false}
                  value={promotionSelectedValues.percentageOff || undefined}
                  className="discount-percentage-input"
                />
                {' '}
                off the total order.
              </>
            )}
            {promotionSelectedValues.discountType === 'freeItems' && (
              <>
                You will get
                {' '}
                <Input className="free-item-quantity" name="freeItemQuantity" placeholder="Quantity" onChange={handleChange} value={promotionSelectedValues.freeItemQuantity || ''} />
                {' '}
                free
                {' '}
                {promotionSelectedValues.freeItemQuantity && (
                  <Dropdown
                    placeholder="Product"
                    name="freeItemProduct"
                    selection
                    options={availableStock}
                    onChange={(e, { name, value }) => { handleChange(e, { name, value }); setDiscountsComplete(true); }}
                    value={promotionSelectedValues.freeItemProduct || undefined}
                  />
                )}
              </>
            )}
            {conditionsComplete && discountsComplete && !promotionSaved && (
              <Button primary floated="right" icon="check" basic size="tiny" onClick={() => setPromotionSaved(true)} />
            )}

          </PromotionModalStyle>
        ) : (
          <>
            {promotionCopySelection(promotionSelectedValues, availableStock)}
            {promotionSaved && (
              <Button primary floated="right" icon="edit" basic size="tiny" onClick={() => setPromotionSaved(false)} />
            )}
          </>
        )}

      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleModalClose} content="Close" />
        <Button
          primary
          className="stock-save"
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

PromotionModal.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  producerProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  profileFetch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  producerProfile: makeSelectProducerProfile(),
  userProfile: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    profileFetch: (location) => dispatch(fetchProfile(location.pathname)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(PromotionModal);
