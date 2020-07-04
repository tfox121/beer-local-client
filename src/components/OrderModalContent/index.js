/* eslint-disable no-param-reassign */
/**
 *
 * OrderModalContent
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { PACK_SIZES } from '../../utils/constants';

function OrderModalContent({ businessName, orderItems, type }) {
  return (
    <Modal.Content>
      <Modal.Description>
        {type === 'draftOrder' && (
          <>
            <Header>{`Your order from ${businessName}`}</Header>
            <p>This is the contents of your order. Click below to confirm, or cancel to go back.</p>
          </>
        )}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>ABV</Table.HeaderCell>
              <Table.HeaderCell>Pack Size</Table.HeaderCell>
              <Table.HeaderCell>List Price</Table.HeaderCell>
              <Table.HeaderCell>Order #</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orderItems.map((stockItem) => {
              if (!stockItem.orderQuant) {
                return null;
              }
              return (
                <Table.Row key={stockItem.id}>
                  <Table.Cell>{stockItem.name}</Table.Cell>
                  <Table.Cell>
                    <NumberFormat
                      displayType="text"
                      decimalScale={1}
                      fixedDecimalScale
                      suffix="%"
                      value={stockItem.abv}
                    />
                  </Table.Cell>
                  <Table.Cell>{PACK_SIZES[stockItem.packSize]}</Table.Cell>
                  <Table.Cell>
                    <NumberFormat
                      displayType="text"
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="£"
                      value={stockItem.price}
                    />
                  </Table.Cell>
                  <Table.Cell>{stockItem.orderQuant}</Table.Cell>
                  <Table.Cell>
                    <NumberFormat
                      displayType="text"
                      thousandSeparator
                      decimalScale={2}
                      fixedDecimalScale
                      prefix="£"
                      value={stockItem.price * stockItem.orderQuant}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={5} textAlign="right">Estimated Total:</Table.HeaderCell>
              <Table.HeaderCell>
                <NumberFormat
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="£"
                  value={orderItems.reduce((acc, val) => { acc += (val.price * val.orderQuant); return acc; }, 0)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Modal.Description>
    </Modal.Content>
  );
}

OrderModalContent.propTypes = {
  businessName: PropTypes.string,
  orderItems: PropTypes.array,
  type: PropTypes.string,
};

export default OrderModalContent;
