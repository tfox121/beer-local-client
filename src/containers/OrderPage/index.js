/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';
import { Map, TileLayer } from 'react-leaflet';

import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Button, Modal, Form, Grid, Message, TextArea,
} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';
import {
  fetchOrder, clearOrder, editOrder, sendMessage,
} from './actions';

import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser, makeSelectLocation } from '../App/selectors';
import { makeSelectOrder, makeSelectEditingOrder, makeSelectSendingMessage } from './selectors';
import OrderModalContent from '../../components/OrderModalContent';
import { getPrivateRoute } from '../../utils/api';
import MessageFeed from '../../components/MessageFeed';
import Can from '../../components/Can';
import MapStyle from './MapStyle';
import MapMarker from '../../components/MapMarker';
import MessageBoxStyle from './MessageBoxStyle';
import { ORDER_MESSAGE_CHARACTER_LIMIT, MAP_TILE_PROVIDER_URL } from '../../utils/constants';

const OrderPage = ({
  orderInfo, orderFetch, orderClear, userProfile, routerLocation, orderEdit, orderEditing, messageSend, messageSending,
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
    // const privateRoute = await getPrivateRoute();
    const confirmedOrder = { _id: orderData._id, status: orderData.status === 'Confirmed' ? 'Pending' : 'Confirmed' };
    // try {
    // const response = await privateRoute.patch(`/orders/${orderData._id}`, confirmedOrder);
    orderEdit(confirmedOrder);
    // setOrderData(confirmedOrder);
    // orderFetch();
    // console.log('RESPONSE', response.data);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  const handleChangesConfirm = async () => {
    // const privateRoute = await getPrivateRoute();
    const itemsApproved = orderItems
      .filter((orderItem) => orderItem.orderChange !== 'delete')
      .map((orderItem) => ({ ...orderItem, orderChange: '' }));
    const pendingOrder = { _id: orderData._id, status: 'Pending', items: itemsApproved };
    orderEdit(pendingOrder);

    // try {
    //   const response = await privateRoute.patch(`/orders/${orderData._id}`, confirmedOrder);
    //   // setOrderData(confirmedOrder);
    //   orderFetch();
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
    //   const response = await privateRoute.patch(`/orders/${orderData._id}`, rejectedOrder);
    //   // setOrderData(rejectedOrder);
    //   orderFetch();
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
    //   const response = await privateRoute.patch(`/orders/${orderData._id}`, cancelledOrder);
    //   // setOrderData(rejectedOrder);
    //   orderFetch();
    //   console.log(response);
    // } catch (err) {
    //   console.error(err);
    // }
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
      if (orderItem.id === id && orderItem.orderQuant > 1) {
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
    // const privateRoute = await getPrivateRoute();
    const editedOrder = { _id: orderData._id, status: 'Changes pending', items: [...orderItems] };
    // const response = await privateRoute.patch(`/orders/${orderData._id}`, editedOrder);
    orderEdit(editedOrder);

    // setOrderData(rejectedOrder);
    // orderFetch();
    setEditingOrder(false);
    setOrderEditPending(false);
    // console.log(response.data);
  };

  const handleMessageSend = async () => {
    // const privatSeRoute = await getPrivateRoute();
    messageSend({ _id: orderData._id, content: messageContent });

    // const response = await privateRoute.post(`/orders/${orderData._id}/message`, { content: messageContent });
    // setOrderData(rejectedOrder);
    // orderFetch();
    setMessageContent('');
    setMessageModalOpen(false);
    // console.log(response.data);
  };

  if (!orderInfo.business || !orderItems || !Object.keys(orderData).length) {
    console.log(!orderInfo.business, !orderItems, !Object.keys(orderData).length);
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
            <Message negative>
              <Message.Header>{`This order has been ${orderData.status.toLowerCase()}.`}</Message.Header>
              <p>
                If this is a mistake, please contact us
                {' '}
                <Link to="/">here</Link>
                .
              </p>
            </Message>
          )}
          {(orderData.status === 'Confirmed' && role === 'retailer') && (
            <Message info>
              <Message.Header>Your order has been confirmed!</Message.Header>
            </Message>
          )}
          {(orderData.status === 'Changes pending' && role === 'retailer') && (
            <Message warning>
              <Message.Header>Your order has changes pending.</Message.Header>
              <p>
                Please approve the changes or cancel the order.
              </p>
            </Message>
          )}
          {(orderData.status === 'Changes pending' && role === 'producer') && (
            <Message>
              <Message.Header>Awaiting approval for order changes from the customer.</Message.Header>
            </Message>
          )}
          {(orderData.status === 'Pending' && role === 'retailer') && (
            <Message>
              <Message.Header>Awaiting order confirmation from the brewery.</Message.Header>
            </Message>
          )}
          {((orderData.status === 'Pending' || orderData.status === 'Confirmed') && role === 'producer' && orderInfo.business.deliveryInstruction) && (
            <Message warning>
              <Message.Header>This customer has specific requirements for delivery.</Message.Header>
              <p>{orderInfo.business.deliveryInstruction}</p>
            </Message>
          )}
          <Button.Group>
            <Can
              role={role}
              perform="orders:confirm"
              yes={() => (orderData.status === 'Pending' || orderData.status === 'Confirmed') && (
                <Button onClick={handleConfirm} loading={orderEditing} basic={orderData.status !== 'Confirmed'} color="green" icon="check" content={orderData.status !== 'Confirmed' ? 'Confirm order' : 'Confirmed - click again to undo'} />
              )}
            />
            <Can
              role={role}
              perform="orders:changes-confirm"
              yes={() => (orderData.status === 'Changes pending') && (
                <Button onClick={handleChangesConfirm} loading={orderEditing} color="green" icon="check" content="Approve changes" />
              )}
            />
            <Can
              role={role}
              perform="orders:reject"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending' || orderData.status === 'Rejected') && (
                <Button onClick={handleReject} loading={orderEditing} basic={orderData.status !== 'Rejected'} color="red" icon="ban" content={orderData.status !== 'Rejected' ? 'Reject order' : 'Rejected - click again to undo'} />
              )}
            />
            <Can
              role={role}
              perform="orders:cancel"
              yes={() => (orderData.status === 'Changes pending' || orderData.status === 'Pending') && (
                <Button onClick={handleCancel} loading={orderEditing} basic={orderData.status !== 'Cancelled'} color="red" icon="close" content={orderData.status !== 'Cancelled' ? 'Cancel order' : 'Cancelled - click again to undo'} />
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
                        url={MAP_TILE_PROVIDER_URL}
                      />
                      <MapMarker type="customer" location={orderInfo.business.location} name={orderInfo.business.businessName} />
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
          <MessageBoxStyle>
            <TextArea maxLength={ORDER_MESSAGE_CHARACTER_LIMIT} value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder={`Write your message to ${orderInfo.business.primaryContactName} at ${orderInfo.business.businessName}...`} />
            <Button attached="right" primary content="Send" onClick={handleMessageSend} loading={messageSending} />
          </MessageBoxStyle>
          {!!messageContent.length && (
            <p style={{ textAlign: 'right', fontSize: '10px' }}>
              {messageContent.length}
              /
              {ORDER_MESSAGE_CHARACTER_LIMIT}
            </p>
          )}
          {/* {messageModalOpen
            ? (
              <Button.Group>
                <Button content="Cancel" onClick={() => setMessageModalOpen(false)} />
                <Button primary content="Send" onClick={handleMessageSend} />
              </Button.Group>
            )
            : <Button size="large" loading={messageSending} onClick={() => setMessageModalOpen(true)}>Add Message</Button> } */}
          {/* <Modal basic size="tiny" open={messageModalOpen}>
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
          </Modal> */}

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
  orderEdit: PropTypes.func,
  orderEditing: PropTypes.bool,
  messageSend: PropTypes.func,
  messageSending: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  orderInfo: makeSelectOrder(),
  userProfile: makeSelectUser(),
  routerLocation: makeSelectLocation(),
  orderEditing: makeSelectEditingOrder(),
  messageSending: makeSelectSendingMessage(),
});

function mapDispatchToProps(dispatch, { location }) {
  return {
    orderFetch: () => dispatch(fetchOrder(location.pathname)),
    orderEdit: (editObj) => dispatch(editOrder(editObj)),
    orderClear: () => dispatch(clearOrder()),
    messageSend: (messageContent) => dispatch(sendMessage(messageContent)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(OrderPage);
