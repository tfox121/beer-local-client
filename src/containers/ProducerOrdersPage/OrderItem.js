/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table, Modal, Button, Header, Form, Popup,
} from 'semantic-ui-react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { getPrivateRoute } from '../../utils/api';
import OrderModalContent from '../../components/OrderModalContent';
import Can from '../../components/Can';
import { fetchOrders } from './actions';
import { makeSelectUser } from '../App/selectors';
import MessageFeed from '../../components/MessageFeed';

const OrderItem = ({
  userProfile, ordersInfo, order, index, ordersFetch,
}) => {
  const [orderData, setOrderData] = useState({ ...order });
  const [orderItems, setOrderItems] = useState([...order.items]);
  const [availableStock, setAvailableStock] = useState([]);
  const [editingOrder, setEditingOrder] = useState(false);
  const [orderEditPending, setOrderEditPending] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const { role } = userProfile;

  useEffect(() => {
    console.log(ordersInfo);
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
    const confirmedOrder = { status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    try {
      const response = await privateRoute.patch(`/orders/${order._id}`, confirmedOrder);
      // setOrderData(confirmedOrder);
      ordersFetch();
      console.log('RESPONSE', response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangesConfirm = async () => {
    const privateRoute = await getPrivateRoute();
    const itemsApproved = orderItems
      .filter((orderItem) => orderItem.orderChange !== 'delete')
      .map((orderItem) => ({ ...orderItem, orderChange: '' }));
    const confirmedOrder = { status: 'Pending', items: itemsApproved };

    try {
      const response = await privateRoute.patch(`/orders/${order._id}`, confirmedOrder);
      // setOrderData(confirmedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    const privateRoute = await getPrivateRoute();
    const rejectedOrder = { status: orderData.status === 'Rejected' ? 'Pending' : 'Rejected' };
    try {
      const response = await privateRoute.patch(`/orders/${order._id}`, rejectedOrder);
      // setOrderData(rejectedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async () => {
    const privateRoute = await getPrivateRoute();
    const cancelledOrder = { status: 'Cancelled' };
    try {
      const response = await privateRoute.patch(`/orders/${order._id}`, cancelledOrder);
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
        const originalItem = orderData.items.filter((origOrderItem) => origOrderItem.id === id)[0];
        if (orderItem.orderChange !== 'add') {
          if (originalItem && decreasedItem.orderQuant < originalItem.orderQuant) {
            decreasedItem.orderChange = 'decrease';
          } else {
            delete decreasedItem.orderChange;
          }
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
        const originalItem = orderData.items.filter((origOrderItem) => origOrderItem.id === id)[0];
        if (orderItem.orderChange !== 'add') {
          if (originalItem && increasedItem.orderQuant > originalItem.orderQuant) {
            increasedItem.orderChange = 'increase';
          } else {
            delete increasedItem.orderChange;
          }
        }
        return increasedItem;
      }
      return orderItem;
    });
    setOrderItems(orderItemsEdit);
  };

  const handleSave = async () => {
    const privateRoute = await getPrivateRoute();
    const editedOrder = { status: 'Changes pending', items: [...orderItems] };
    const response = await privateRoute.patch(`/orders/${order._id}`, editedOrder);
    // setOrderData(rejectedOrder);
    ordersFetch();
    setEditingOrder(false);
    setOrderEditPending(false);
    console.log(response);
  };

  const handleMessageSend = async () => {
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.post(`/orders/${order._id}/message`, { content: messageContent });
    // setOrderData(rejectedOrder);
    ordersFetch();
    setMessageModalOpen(false);
    console.log(response);
  };

  return (
    <Popup
      trigger={(
        <Table.Row warning={userProfile.role === 'producer' ? orderData.producerNotification : orderData.retailerNotification} style={{ color: (order.status === 'Rejected' || order.status === 'Cancelled') && 'lightgray' }}>
          <Table.Cell>{`SO-${order.orderNumber.toString().padStart(6, '0')}`}</Table.Cell>
          <Table.Cell>{moment(order.received).format('DD/MM/YYYY')}</Table.Cell>
          <Table.Cell>
            {userProfile.role === 'retailer'
              ? <Link to={`/brewery/${ordersInfo.businesses[index].businessId}`}>{ordersInfo.businesses[index].businessName}</Link>
              : <>{ordersInfo.businesses[index].businessName}</>}
          </Table.Cell>
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
          <Table.Cell textAlign="center" width={2}><Link to={`/order/${order._id}`}>View Details</Link></Table.Cell>
          {/* <Modal
        trigger={<Table.Cell textAlign="center" width={2}>View Details</Table.Cell>}
        dimmer="inverted"
      >
        <Modal.Content>
          <Modal.Description>
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
          </Modal.Description>
          <MessageFeed messages={order.messages} user={userProfile} business={ordersInfo.businesses[index]} businessAvatar={ordersInfo.images[index]} />
        </Modal.Content>
        <Modal.Actions>
          {editingOrder
            ? (
              <>
                <Button content="Cancel" onClick={() => setEditingOrder(false)} />
                <Button content="Save" primary onClick={handleSave} />
              </>
            )
            : (
              <>
                <Modal basic size="tiny" open={messageModalOpen} trigger={<Button onClick={() => setMessageModalOpen(true)}>Add Message</Button>}>
                  <Modal.Content>
                    <Modal.Description>
                      <Header>Add Message</Header>
                      <Form>
                        <Form.TextArea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Write your message..." />
                      </Form>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button color="red" inverted content="Cancel" onClick={() => setMessageModalOpen(false)} />
                    <Button primary inverted content="Submit" onClick={handleMessageSend} />
                  </Modal.Actions>
                </Modal>
                <Can
                  role={role}
                  perform="orders:edit"
                  yes={() => <Button primary content="Edit" onClick={() => setEditingOrder(true)} />}
                />
              </>
            )}
        </Modal.Actions>
      </Modal> */}
          <Table.Cell textAlign="center">
            <Can
              role={role}
              perform="orders:confirm"
              yes={() => (orderData.status === 'Pending' || orderData.status === 'Confirmed') && (
                <Button onClick={handleConfirm} basic={orderData.status !== 'Confirmed'} color="green" icon="check" title="Confirm order" />
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
                <Button onClick={handleReject} basic={orderData.status !== 'Rejected'} color="red" icon="ban" title="Reject order" />
              )}
            />
            <Can
              role={role}
              perform="orders:cancel"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending') && (
                <Button onClick={handleCancel} basic={orderData.status !== 'Cancelled'} color="red" icon="close" title="Cancel order" />
              )}
            />
          </Table.Cell>
        </Table.Row>
      )}
      content={(
        <>
          <OrderModalContent
            orderItems={orderItems}
            businessName={ordersInfo.businesses[index].businessName}
            type="orderInfo"
          />
        </>
      )}
      basic
      wide="very"
    />
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
