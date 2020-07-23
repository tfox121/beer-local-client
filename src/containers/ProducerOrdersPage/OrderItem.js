/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table, Button, Popup, Image,
} from 'semantic-ui-react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

import calcOrderTotal from '../../utils/calcOrderTotal';
import OrderModalContent from '../../components/OrderModalContent';
import Can from '../../components/Can';
import { editOrder } from './actions';
import { makeSelectUser } from '../App/selectors';
import { makeSelectEditingOrder } from './selectors';

const OrderItem = ({
  userProfile, ordersInfo, order, index, orderEdit, orderEditing,
}) => {
  const [orderData, setOrderData] = useState({ ...order });

  const { role } = userProfile;

  useEffect(() => {
    setOrderData({ ...order });
  }, [order]);

  const handleConfirm = async () => {
    // const privateRoute = await getPrivateRoute();
    const confirmedOrder = { _id: orderData._id, status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    orderEdit(confirmedOrder);
    // try {
    //   const response = await privateRoute.patch(`/orders/${order._id}`, confirmedOrder);
    //   // setOrderData(confirmedOrder);
    //   ordersFetch();
    //   console.log('RESPONSE', response.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleChangesConfirm = async () => {
    // const privateRoute = await getPrivateRoute();
    const itemsApproved = order.items
      .filter((orderItem) => orderItem.orderChange !== 'delete')
      .map((orderItem) => ({ ...orderItem, orderChange: '' }));
    const pendingOrder = { _id: orderData._id, status: 'Pending', items: itemsApproved };

    orderEdit(pendingOrder);

    // try {
    //   const response = await privateRoute.patch(`/orders/${order._id}`, confirmedOrder);
    //   // setOrderData(confirmedOrder);
    //   ordersFetch();
    //   console.log(response);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleReject = async () => {
    // const privateRoute = await getPrivateRoute();
    const rejectedOrder = { _id: orderData._id, status: orderData.status === 'Rejected' ? 'Pending' : 'Rejected' };

    orderEdit(rejectedOrder);
    // try {
    //   const response = await privateRoute.patch(`/orders/${order._id}`, rejectedOrder);
    //   // setOrderData(rejectedOrder);
    //   ordersFetch();
    //   console.log(response);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleCancel = async () => {
    // const privateRoute = await getPrivateRoute();
    const cancelledOrder = { _id: orderData._id, status: 'Cancelled' };

    orderEdit(cancelledOrder);

    // try {
    //   const response = await privateRoute.patch(`/orders/${order._id}`, cancelledOrder);
    //   // setOrderData(rejectedOrder);
    //   ordersFetch();
    //   console.log(response);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <Popup
      mouseEnterDelay={500}
      trigger={(
        <Table.Row warning={userProfile.role === 'producer' ? orderData.producerNotification : orderData.retailerNotification} style={{ color: (order.status === 'Rejected' || order.status === 'Cancelled') && 'lightgray' }}>
          <Table.Cell>{`SO-${order.orderNumber.toString().padStart(6, '0')}`}</Table.Cell>
          <Table.Cell>{moment(order.createdAt).format('DD/MM/YYYY')}</Table.Cell>
          <Table.Cell>
            <Image style={{ marginLeft: '0.5em' }} src={ordersInfo.businesses[index].avatarSource || '/images/avatars/blank-avatar.webp'} alt="user avatar" avatar />
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
              value={calcOrderTotal(order.items)}
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
              orderItems={order.items}
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
                <Button loading={orderEditing === orderData._id} onClick={handleConfirm} basic={orderData.status !== 'Confirmed'} color="green" icon="check" title="Confirm order" />
              )}
            />
            <Can
              role={role}
              perform="orders:changes-confirm"
              yes={() => (orderData.status === 'Changes pending') && (
                <Button loading={orderEditing === orderData._id} onClick={handleChangesConfirm} color="green" icon="check" title="Approve changes" />
              )}
            />
            <Can
              role={role}
              perform="orders:reject"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending' || orderData.status === 'Rejected') && (
                <Button loading={orderEditing === orderData._id} onClick={handleReject} basic={orderData.status !== 'Rejected'} color="red" icon="ban" title="Reject order" />
              )}
            />
            <Can
              role={role}
              perform="orders:cancel"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending') && (
                <Button loading={orderEditing === orderData._id} onClick={handleCancel} basic={orderData.status !== 'Cancelled'} color="red" icon="close" title="Cancel order" />
              )}
            />
          </Table.Cell>
        </Table.Row>
      )}
      content={(
        <>
          <OrderModalContent
            orderItems={order.items}
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
  orderEdit: PropTypes.func,
  role: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  orderEditing: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
  orderEditing: makeSelectEditingOrder(),
});

function mapDispatchToProps(dispatch) {
  return {
    orderEdit: (editObj) => dispatch(editOrder(editObj)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(OrderItem);
