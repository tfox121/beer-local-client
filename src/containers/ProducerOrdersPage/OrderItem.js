import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Button } from 'semantic-ui-react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getPrivateRoute } from '../../utils/api';
import OrderModalContent from '../../components/OrderModalContent';
import Can from '../../components/Can';
import { fetchOrders } from './actions';

const OrderItem = ({
  ordersInfo, order, index, ordersFetch, role,
}) => {
  const [orderData, setOrderData] = useState({ ...order });

  useEffect(() => {
    setOrderData({ ...order });
  }, [order]);

  const handleConfirm = async () => {
    const privateRoute = await getPrivateRoute();
    const confirmedOrder = { ...orderData, status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    try {
      const response = await privateRoute.patch('/producer/orders', confirmedOrder);
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
      const response = await privateRoute.patch('/producer/orders', rejectedOrder);
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
      const response = await privateRoute.patch('/producer/orders', cancelledOrder);
      // setOrderData(rejectedOrder);
      ordersFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
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
          value={order.items.reduce((acc, val) => { acc += (val.price * val.orderQuant); return acc; }, 0)}
        />
      </Table.Cell>
      <Table.Cell style={{ fontWeight: order.status === 'Confirmed' && 'bold' }}>{order.status}</Table.Cell>
      <Modal
        trigger={<Table.Cell textAlign="center" width={2}>View Details</Table.Cell>}
        basic
        dimmer="inverted"
      >
        <OrderModalContent orderItems={order.items} businessName={ordersInfo.businesses[index].businessName} type="orderInfo" />
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
          perform="orders:reject"
          yes={() => (orderData.status === 'Pending' || orderData.status === 'Rejected') && (
            <Button onClick={handleReject} basic={orderData.status === 'Rejected'} color="red" icon="ban" title="Reject order" />
          )}
        />
        <Can
          role={role}
          perform="orders:cancel"
          yes={() => (orderData.status === 'Pending' || orderData.status === 'Cancelled') && (
            <Button onClick={handleCancel} basic={orderData.status === 'Cancelled'} color="red" icon="close" title="Cancel order" />
          )}
        />
      </Table.Cell>
    </Table.Row>
  );
};

OrderItem.propTypes = {
  ordersInfo: PropTypes.object,
  order: PropTypes.object,
  index: PropTypes.number,
  ordersFetch: PropTypes.func,
  role: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

function mapDispatchToProps(dispatch) {
  return {
    ordersFetch: () => dispatch(fetchOrders()),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(OrderItem);
