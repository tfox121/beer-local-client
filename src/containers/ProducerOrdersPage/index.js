/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';

import { createStructuredSelector } from 'reselect';
import { Header, Table, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
// import { loadSession, closeSession } from './actions';
import reducer from './reducer';
import saga from './saga';
import { makeSelectProducerOrders } from './selectors';
import { fetchOrders, clearOrders } from './actions';

import OrderItem from './OrderItem';
import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser } from '../App/selectors';

const ProducerOrdersPage = ({
  ordersInfo, ordersFetch, ordersClear, userProfile,
}) => {
  useInjectReducer({ key: 'ProducerOrdersPage', reducer });
  useInjectSaga({ key: 'ProducerOrdersPage', saga });
  const { isAuthenticated } = useAuth0();
  const role = userProfile && userProfile.role;

  useEffect(() => {
    if (isAuthenticated) {
      ordersFetch();
      return;
    }
    ordersClear();
  }, [isAuthenticated, ordersFetch, ordersClear]);

  return (
    <>
      <Helmet>
        <title>beerLocal - Order History</title>
        <meta name="description" content="Your orders" />
      </Helmet>
      <PageWrapper>
        <Segment basic padded="very" className="primary">
          <Header as="h1">Order History:</Header>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order no.</Table.HeaderCell>
                <Table.HeaderCell>Order date</Table.HeaderCell>
                <Table.HeaderCell>{role === 'producer' ? 'Purchaser' : 'Brewery'}</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell />
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ordersInfo && ordersInfo.businesses && ordersInfo.orders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <OrderItem ordersInfo={ordersInfo} order={order} index={index} role={role} />
                </React.Fragment>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      </PageWrapper>
    </>
  );
};

ProducerOrdersPage.propTypes = {
  ordersInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  ordersFetch: PropTypes.func,
  ordersClear: PropTypes.func,
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  ordersInfo: makeSelectProducerOrders(),
  userProfile: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    ordersFetch: () => dispatch(fetchOrders()),
    ordersClear: () => dispatch(clearOrders()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(ProducerOrdersPage);
