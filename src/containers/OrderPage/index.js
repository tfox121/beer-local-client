/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { Map, TileLayer } from 'react-leaflet';

import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Button, Modal, Form, Grid, Message,
} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';
import { fetchOrder, clearOrder } from './actions';

import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser, makeSelectLocation } from '../App/selectors';
import { makeSelectOrder } from './selectors';
import OrderModalContent from '../../components/OrderModalContent';
import { getPrivateRoute } from '../../utils/api';
import MessageFeed from '../../components/MessageFeed';
import Can from '../../components/Can';
import MapStyle from '../ProducerProfilePage/MapStyle';
import MapMarker from '../../components/MapMarker';

const OrderPage = ({
  orderInfo, orderFetch, orderClear, userProfile, routerLocation,
}) => {
  useInjectReducer({ key: 'OrderPage', reducer });
  useInjectSaga({ key: 'OrderPage', saga });
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      orderFetch();
    }
    return () => {
      orderClear();
    };
  }, [isAuthenticated, orderFetch, orderClear]);

  console.log('ORDER', orderInfo);

  const { pathname } = routerLocation;
  const { role } = userProfile;

  const [editingOrder, setEditingOrder] = useState(false);
  const [orderData, setOrderData] = useState({ ...orderInfo.order });
  const [orderItems, setOrderItems] = useState([]);
  const [availableStock, setAvailableStock] = useState([]);
  const [orderEditPending, setOrderEditPending] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    if (orderInfo.order && orderInfo.order.items) {
      setOrderData({ ...orderInfo.order });
      setOrderItems([...orderInfo.order.items]);
    }
  }, [orderInfo]);

  useEffect(() => {
    if (userProfile && userProfile.stock && orderItems.length) {
      const orderIds = orderItems.map((orderItem) => orderItem.id);
      setAvailableStock(userProfile.stock
        .filter((stockItem) => stockItem.display === 'Show' && !orderIds.includes(stockItem.id))
        .map((stockItem) => ({ ...stockItem, value: stockItem.id, label: `${stockItem.name} ${stockItem.packSize} ${stockItem.availability}` })));
    }
  }, [userProfile.stock, orderItems]);

  useEffect(() => {
    if (orderData) {
      const clearNotification = async () => {
        const privateRoute = await getPrivateRoute();
        if (role === 'producer' && orderData.producerNotification) {
          privateRoute.patch(`/orders/${orderData._id}`, { producerNotification: false });
        } else if (role === 'retailer' && orderData.retailerNotification) {
          privateRoute.patch(`/orders/${orderData._id}`, { retailerNotification: false });
        }
      };
      clearNotification();
    }
  }, [orderData]);

  const handleCancelEdit = () => {
    setOrderItems([...orderInfo.order.items]);
    setEditingOrder(false);
  };

  const handleConfirm = async () => {
    const privateRoute = await getPrivateRoute();
    const confirmedOrder = { status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    try {
      const response = await privateRoute.patch(`/orders/${orderData._id}`, confirmedOrder);
      // setOrderData(confirmedOrder);
      orderFetch();
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
      const response = await privateRoute.patch(`/orders/${orderData._id}`, confirmedOrder);
      // setOrderData(confirmedOrder);
      orderFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    const privateRoute = await getPrivateRoute();
    const rejectedOrder = { status: orderData.status === 'Rejected' ? 'Pending' : 'Rejected' };
    try {
      const response = await privateRoute.patch(`/orders/${orderData._id}`, rejectedOrder);
      // setOrderData(rejectedOrder);
      orderFetch();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async () => {
    const privateRoute = await getPrivateRoute();
    const cancelledOrder = { status: 'Cancelled' };
    try {
      const response = await privateRoute.patch(`/orders/${orderData._id}`, cancelledOrder);
      // setOrderData(rejectedOrder);
      orderFetch();
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
    const response = await privateRoute.patch(`/orders/${orderData._id}`, editedOrder);
    // setOrderData(rejectedOrder);
    orderFetch();
    setEditingOrder(false);
    setOrderEditPending(false);
    console.log(response.data);
  };

  const handleMessageSend = async () => {
    const privateRoute = await getPrivateRoute();
    const response = await privateRoute.post(`/orders/${orderData._id}/message`, { content: messageContent });
    // setOrderData(rejectedOrder);
    orderFetch();
    setMessageContent('');
    setMessageModalOpen(false);
    console.log(response.data);
  };

  if (!orderInfo.business || !orderItems || !Object.keys(orderData).length) {
    return null;
  }

  console.log('ITEMS', orderItems);

  return (
    <>
      <Helmet>
        <title>beerLocal - Order Info</title>
        <meta name="description" content="Your order" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">{`Order #SO-${orderData.orderNumber.toString().padStart(6, '0')} from ${orderInfo.business.businessName}`}</Header>
          {(orderData.status === 'Cancelled' || orderData.status === 'Rejected') && (
            <Message warning>
              <Message.Header>{`This order has been ${orderData.status.toLowerCase()}`}</Message.Header>
              <p>
                If this is a mistake, please contact us
                {' '}
                <Link to="/">here</Link>
                .
              </p>
            </Message>
          )}
          <Button.Group>
            <Can
              role={role}
              perform="orders:confirm"
              yes={() => (orderData.status === 'Pending' || orderData.status === 'Confirmed') && (
                <Button onClick={handleConfirm} basic={orderData.status !== 'Confirmed'} color="green" icon="check" content={orderData.status !== 'Confirmed' ? 'Confirm order' : 'Confirmed - click again to undo'} />
              )}
            />
            <Can
              role={role}
              perform="orders:changes-confirm"
              yes={() => (orderData.status === 'Changes pending') && (
                <Button onClick={handleChangesConfirm} color="green" icon="check" content="Approve changes" />
              )}
            />
            <Can
              role={role}
              perform="orders:reject"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending' || orderData.status === 'Rejected') && (
                <Button onClick={handleReject} basic={orderData.status !== 'Rejected'} color="red" icon="ban" content={orderData.status !== 'Rejected' ? 'Reject order' : 'Rejected - click again to undo'} />
              )}
            />
            <Can
              role={role}
              perform="orders:cancel"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending') && (
                <Button onClick={handleCancel} basic={orderData.status !== 'Cancelled'} color="red" icon="close" content={orderData.status !== 'Cancelled' ? 'Cancel order' : 'Cancelled - click again to undo'} />
              )}
            />
          </Button.Group>
          <Segment basic>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <p>{orderInfo.business.businessName}</p>
                  {orderInfo.business.address.split(',').map((addressLine) => (
                    <p key={addressLine}>{addressLine}</p>
                  ))}
                </Grid.Column>
                <Grid.Column>
                  <MapStyle>
                    <Map
                      className="profileViewMap"
                      center={orderInfo.business.location}
                      zoom={12}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                      />
                      <MapMarker location={orderInfo.business.location} />
                    </Map>
                  </MapStyle>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <OrderModalContent
            editingOrder={editingOrder}
            orderItems={orderItems}
            availableStock={availableStock}
            handleAddItem={handleAddItem}
            handleDeleteItem={handleDeleteItem}
            handleDecreaseQuant={handleDecreaseQuant}
            handleIncreaseQuant={handleIncreaseQuant}
            businessName={orderInfo.business.businessName}
            type="orderInfo"
          />
          <br />
          {editingOrder
            ? (
              <Button.Group>
                <Button content="Cancel" onClick={handleCancelEdit} />
                <Button content="Save" primary onClick={handleSave} />
              </Button.Group>
            )
            : (
              <Can
                role={role}
                perform="orders:edit"
                yes={() => orderData.status !== 'Cancelled' && orderData.status !== 'Rejected' && (
                  <Button primary content="Edit" size="large" onClick={() => setEditingOrder(true)} />
                )}
              />
            )}
          <MessageFeed messages={orderData.messages} user={userProfile} business={orderInfo.business} businessAvatar={orderInfo.image} />
          <Modal basic size="tiny" open={messageModalOpen} trigger={<Button size="large" onClick={() => setMessageModalOpen(true)}>Add Message</Button>}>
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
        </Segment>
      </PageWrapper>
    </>
  );
};

OrderPage.propTypes = {
  orderInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  orderFetch: PropTypes.func,
  orderClear: PropTypes.func,
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  routerLocation: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  orderInfo: makeSelectOrder(),
  userProfile: makeSelectUser(),
  routerLocation: makeSelectLocation(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    orderFetch: () => dispatch(fetchOrder(location.pathname)),
    orderClear: () => dispatch(clearOrder()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(OrderPage);