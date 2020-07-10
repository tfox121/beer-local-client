/* eslint-disable no-param-reassign */
/**
 *
 * OrderModalContent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { PACK_SIZES } from '../../utils/constants';

function OrderLine({
  orderLine, editingOrder, handleDeleteItem, handleDecreaseQuant, handleIncreaseQuant,
}) {
  if (!orderLine) {
    return null;
  }

  return (
    <Table.Row positive={orderLine.orderChange === 'add'} key={orderLine.id}>
      <Table.Cell disabled={orderLine.orderChange === 'delete'}>{orderLine.name}</Table.Cell>
      <Table.Cell disabled={orderLine.orderChange === 'delete'}>
        <NumberFormat
          displayType="text"
          decimalScale={1}
          fixedDecimalScale
          suffix="%"
          value={orderLine.abv}
        />
      </Table.Cell>
      <Table.Cell disabled={orderLine.orderChange === 'delete'}>{PACK_SIZES[orderLine.packSize]}</Table.Cell>
      <Table.Cell disabled={orderLine.orderChange === 'delete'}>
        <NumberFormat
          displayType="text"
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix="£"
          value={orderLine.price}
        />
      </Table.Cell>
      <Table.Cell disabled={orderLine.orderChange === 'delete'} positive={orderLine.orderChange === 'increase'} negative={orderLine.orderChange === 'decrease'}>
        {orderLine.orderQuant}
        {editingOrder && (
          <>
            <Button primary size="tiny" icon="minus" onClick={() => handleDecreaseQuant(orderLine.id)} title="Decrease quantity" />
            <Button primary size="tiny" icon="plus" onClick={() => handleIncreaseQuant(orderLine.id)} title="Increase quantity" />
          </>
        )}
      </Table.Cell>
      <Table.Cell disabled={orderLine.orderChange === 'delete'}>
        <NumberFormat
          displayType="text"
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix="£"
          value={orderLine.price * orderLine.orderQuant}
        />
      </Table.Cell>
      {editingOrder && (
        <Table.Cell textAlign="center"><Button color="red" icon="close" title="Cancel item" onClick={() => handleDeleteItem(orderLine.id)} /></Table.Cell>
      )}
    </Table.Row>
  );
}

OrderLine.propTypes = {
  orderLine: PropTypes.object,
};

export default OrderLine;
