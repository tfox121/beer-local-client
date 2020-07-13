/* eslint-disable no-param-reassign */
/**
 *
 * OrderModalContent
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Header, Table, Button, Grid,
} from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import OrderLine from '../OrderLine';

function OrderModalContent({
  editingOrder, businessName, orderItems, availableStock, handleAddItem, handleDeleteItem, handleDecreaseQuant, handleIncreaseQuant, type,
}) {
  const [newItem, setNewItem] = useState({});
  const [addingItem, setAddingItem] = useState(false);

  const handleSelectChange = (selectedOption) => {
    setNewItem(selectedOption);
  };

  const handleAddingItem = () => {
    handleAddItem(newItem);
    setAddingItem(false);
  };

  if (!orderItems) {
    return null;
  }
  return (
    <Modal.Content style={{ overflowX: 'scroll' }}>
      {type === 'draftOrder' && (
        <>
          <Header as="h5">{`Your order from ${businessName}`}</Header>
          <p>This is the contents of your order. Click below to confirm, or cancel to go back.</p>
        </>
      )}
      <Table celled unstackable style={{ minWidth: '600px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>ABV</Table.HeaderCell>
            <Table.HeaderCell>Pack Size</Table.HeaderCell>
            <Table.HeaderCell>List Price</Table.HeaderCell>
            <Table.HeaderCell>Order #</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
            {editingOrder && (
              <Table.HeaderCell></Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orderItems.filter((stockItem) => stockItem.orderQuant).map((stockItem) => (
            <React.Fragment key={stockItem.id}>
              <OrderLine orderLine={stockItem} editingOrder={editingOrder} handleDeleteItem={handleDeleteItem} handleDecreaseQuant={handleDecreaseQuant} handleIncreaseQuant={handleIncreaseQuant} />
            </React.Fragment>
          ))}
        </Table.Body>
        <Table.Footer>
          {editingOrder && !addingItem && (
            <Table.Row>
              <Table.HeaderCell colSpan="16">
                <Button attached basic icon="plus" content="Add item" onClick={() => setAddingItem(true)} />
              </Table.HeaderCell>
            </Table.Row>
          )}
          {editingOrder && addingItem && (
            <Table.Row>
              <Table.HeaderCell colSpan="7">
                <Grid columns={2}>
                  <Grid.Column width={12}>
                    <Select options={availableStock} onChange={handleSelectChange} placeholder="Select item" />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button icon="add" primary fluid content="Add" onClick={handleAddingItem} />
                  </Grid.Column>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.HeaderCell colSpan={editingOrder ? 6 : 5} textAlign="right">Estimated Total:</Table.HeaderCell>
            <Table.HeaderCell>
              <NumberFormat
                displayType="text"
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
                prefix="£"
                value={orderItems.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0)}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Modal.Content>
  );
}

OrderModalContent.propTypes = {
  editingOrder: PropTypes.bool,
  businessName: PropTypes.string,
  orderItems: PropTypes.array,
  type: PropTypes.string,
};

export default OrderModalContent;
