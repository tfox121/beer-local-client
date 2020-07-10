import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Button } from 'semantic-ui-react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getPrivateRoute } from '../../utils/api';
import OrderModalContent from '../../components/OrderModalContent';
import Can from '../../components/Can';
import { fetchOrders } from './actions';
import { makeSelectUser } from '../App/selectors';

const OrderItem = ({
  userProfile, ordersInfo, order, index, ordersFetch,
}) => {
  const [orderData, setOrderData] = useState({ ...order });
  const [orderItems, setOrderItems] = useState([...order.items]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [availableStock, setAvailableStock] = useState([]);
  const [editingOrder, setEditingOrder] = useState(false);
  const [orderEditPending, setOrderEditPending] = useState(false);

  const { role } = userProfile;

  useEffect(() => {
    setOrderData({ ...order });
  }, [order]);

  useEffect(() => {
    if (userProfile && userProfile.stock) {
      const orderIds = orderItems.map((orderItem) => orderItem.id);
      setAvailableStock(userProfile.stock
        .filter((stockItem) => stockItem.display === 'Show' && !orderIds.includes(stockItem.id))
        .map((stockItem) => ({ ...stockItem, value: stockItem.id, label: `${stockItem.name} ${stockItem.packSize} ${stockItem.availability}` })));
    }
  }, [userProfile.stock, orderItems]);

  const handleConfirm = async () => {
    const privateRoute = await getPrivateRoute();
    const confirmedOrder = { ...orderData, status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    try {
      const response = await privateRoute.patch('/user/orders', confirmedOrder);
      // setOrderData(confirmedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangesConfirm = async () => {
    const privateRoute = await getPrivateRoute();
    const itemsApproved = orderItems
      .filter((orderItem) => orderItem.orderChange !== 'delete')
      .map((orderItem) => ({ ...orderItem, orderChange: '' }));
    const confirmedOrder = { ...orderData, status: 'Pending', items: itemsApproved };

    try {
      const response = await privateRoute.patch('/user/orders', confirmedOrder);
      // setOrderData(confirmedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    const privateRoute = await getPrivateRoute();
    const rejectedOrder = { ...orderData, status: orderData.status === 'Rejected' ? 'Pending' : 'Rejected' };
    try {
      const response = await privateRoute.patch('/user/orders', rejectedOrder);
      // setOrderData(rejectedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async () => {
    const privateRoute = await getPrivateRoute();
    const cancelledOrder = { ...orderData, status: 'Cancelled' };
    try {
      const response = await privateRoute.patch('/user/orders', cancelledOrder);
      // setOrderData(rejectedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = (id) => {
    setOrderEditPending(true);
    setOrderItems(orderItems.map((orderItem) => {
      if (orderItem.id === id && orderItem.orderChange === 'delete') {
        return { ...orderItem, orderChange: '' };
      }
      if (orderItem.id === id) {
        return { ...orderItem, orderChange: 'delete' };
      }
      return orderItem;
    }));
  };

  const handleAddItem = (newItem) => {
    setOrderEditPending(true);
    const item = newItem;
    delete item.label;
    delete item.value;
    item.orderChange = 'add';
    item.orderQuant = 1;
    setOrderItems([...orderItems, item]);
  };

  const handleDecreaseQuant = (id) => {
    setOrderEditPending(true);
    const orderItemsEdit = orderItems.map((orderItem) => {
      if (orderItem.id === id && orderItem.orderQuant > 0) {
        const decreasedItem = { ...orderItem, orderQuant: orderItem.orderQuant - 1 };
        const originalItem = order.items.filter((origOrderItem) => origOrderItem.id === id)[0];
        if (originalItem && decreasedItem.orderQuant < originalItem.orderQuant) {
          decreasedItem.orderChange = 'decrease';
        } else {
          delete decreasedItem.orderChange;
        }
        return decreasedItem;
      }
      return orderItem;
    });
    setOrderItems(orderItemsEdit);
  };

  const handleIncreaseQuant = (id) => {
    setOrderEditPending(true);
    const orderItemsEdit = orderItems.map((orderItem) => {
      if (orderItem.id === id) {
        const increasedItem = { ...orderItem, orderQuant: orderItem.orderQuant + 1 };
        const originalItem = order.items.filter((origOrderItem) => origOrderItem.id === id)[0];
        console.log(increasedItem.orderQuant, originalItem.orderQuant);
        if (originalItem && increasedItem.orderQuant > originalItem.orderQuant) {
          increasedItem.orderChange = 'increase';
        } else {
          delete increasedItem.orderChange;
        }
        return increasedItem;
      }
      return orderItem;
    });
    setOrderItems(orderItemsEdit);
  };

  const handleSave = async () => {
    const privateRoute = await getPrivateRoute();
    const editedOrder = { ...orderData, status: 'Changes pending', items: [...orderItems, ...deletedItems] };
    const response = await privateRoute.patch('/user/orders', editedOrder);
    // setOrderData(rejectedOrder);
    ordersFetch();
    setEditingOrder(false);
    setOrderEditPending(false);
    console.log(response);
  };

  return (
    <Table.Row style={{ color: (order.status === 'Rejected' || order.status === 'Cancelled') && 'lightgray' }}>
      <Table.Cell>{`SO-${order.orderNumber.toString().padStart(6, '0')}`}</Table.Cell>
      <Table.Cell>{moment(order.received).format('DD/MM/YYYY')}</Table.Cell>
      <Table.Cell>{ordersInfo.businesses[index].businessName}</Table.Cell>
      <Table.Cell>
        <NumberFormat
          displayType="text"
          thousandSeparator
          decimalScale={2}
          fixedDecimalScale
          prefix="£"
          // eslint-disable-next-line no-param-reassign
          value={order.items.reduce((acc, val) => { acc += (val.orderChange !== 'delete' && val.price * val.orderQuant); return acc; }, 0)}
        />
      </Table.Cell>
      <Table.Cell style={{ fontWeight: order.status === 'Confirmed' && 'bold' }}>{order.status}</Table.Cell>
      <Modal
        trigger={<Table.Cell textAlign="center" width={2}>View Details</Table.Cell>}
        dimmer="inverted"
      >
        <OrderModalContent
          editingOrder={editingOrder}
          orderItems={orderItems}
          availableStock={availableStock}
          handleAddItem={handleAddItem}
          handleDeleteItem={handleDeleteItem}
          handleDecreaseQuant={handleDecreaseQuant}
          handleIncreaseQuant={handleIncreaseQuant}
          businessName={ordersInfo.businesses[index].businessName}
          type="orderInfo"
        />
        {editingOrder
          ? (
            <Modal.Actions>
              <Button content="Cancel" onClick={() => setEditingOrder(false)} />
              <Button content="Save" primary onClick={handleSave} />
            </Modal.Actions>
          )
          : (
            <Can
              role={role}
              perform="orders:edit"
              yes={() => <Modal.Actions><Button primary content="Edit" onClick={() => setEditingOrder(true)} /></Modal.Actions>}
            />
          )}
      </Modal>
      <Table.Cell textAlign="center">
        <Can
          role={role}
          perform="orders:confirm"
          yes={() => (orderData.status === 'Pending' || orderData.status === 'Confirmed') && (
            <Button onClick={handleConfirm} basic={orderData.status === 'Confirmed'} color="green" icon="check" title="Confirm order" />
          )}
        />
        <Can
          role={role}
          perform="orders:changes-confirm"
          yes={() => (orderData.status === 'Changes pending') && (
            <Button onClick={handleChangesConfirm} color="green" icon="check" title="Approve changes" />
          )}
        />
        <Can
          role={role}
          perform="orders:reject"
          yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending' || orderData.status === 'Rejected') && (
            <Button onClick={handleReject} basic={orderData.status === 'Rejected'} color="red" icon="ban" title="Reject order" />
          )}
        />
        <Can
          role={role}
          perform="orders:cancel"
          yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending' || orderData.status === 'Cancelled') && (
            <Button onClick={handleCancel} basic={orderData.status === 'Cancelled'} color="red" icon="close" title="Cancel order" />
          )}
        />
      </Table.Cell>
    </Table.Row>
  );
};

OrderItem.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  ordersInfo: PropTypes.object,
  order: PropTypes.object,
  index: PropTypes.number,
  ordersFetch: PropTypes.func,
  role: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    ordersFetch: () => dispatch(fetchOrders()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(OrderItem);
