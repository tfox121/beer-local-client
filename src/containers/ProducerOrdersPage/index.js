/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useAuth0 } from '@auth0/auth0-react';

import { createStructuredSelector } from 'reselect';
import { Header, Table, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
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
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      ordersFetch();
      return;
    }
    ordersClear();
  }, [isAuthenticated, ordersFetch, ordersClear]);

  useEffect(() => {
    if (ordersInfo && ordersInfo.orders) {
      const statuses = [...new Set(ordersInfo && ordersInfo.orders.map((order) => order.status))];
      setOrderStatuses(statuses.map((status) => ({ label: status, value: status })));
    }
  }, [ordersInfo.orders]);

  const handleSelectChange = (selected, { action }) => {
    if (action === 'clear') {
      setStatusFilter('');
    }
    if (selected) {
      setStatusFilter(selected.value);
    }
  };

  return (
    <>
      <Helmet>
        <title>BeerLocal - Order History</title>
        <meta name="description" content="Your orders" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">Order History</Header>
          <Table unstackable basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order no.</Table.HeaderCell>
                <Table.HeaderCell>Order date</Table.HeaderCell>
                <Table.HeaderCell>{userProfile.role === 'producer' ? 'Purchaser' : 'Brewery'}</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell colSpan={3}>
                  <Select options={orderStatuses} placeholder="Filter" onChange={handleSelectChange} defaultValue="" isClearable escapeClearsValue />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ordersInfo && ordersInfo.businesses && ordersInfo.orders
                .filter((order) => statusFilter ? order.status === statusFilter : true)
                .map((order, index) => (
                  <React.Fragment key={order._id}>
                    <OrderItem ordersInfo={ordersInfo} order={order} index={index} />
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
