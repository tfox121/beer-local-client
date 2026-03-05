/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Header, Table, Segment } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import Select from 'react-select';

import OrderItem from './OrderItem';
import PageWrapper from '../../components/PageWrapper';
import { useUserQuery } from '../../queries/user';
import { useProducerOrdersQuery } from '../../queries/orders';

const ProducerOrdersPage = () => {
  const { isAuthenticated } = useAuth0();
  const { data: userProfile } = useUserQuery({ enabled: isAuthenticated });
  const { data: ordersInfo } = useProducerOrdersQuery({
    enabled: isAuthenticated,
  });
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (ordersInfo && ordersInfo.orders) {
      const statuses = [
        ...new Set(
          ordersInfo && ordersInfo.orders.map((order) => order.status),
        ),
      ];
      setOrderStatuses(
        statuses.map((status) => ({ label: status, value: status })),
      );
    }
  }, [ordersInfo]);

  if (!ordersInfo || !userProfile) {
    return null;
  }

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
        <meta name='description' content='Your orders' />
      </Helmet>
      <PageWrapper>
        <Segment basic className='primary wrapper'>
          <Header as='h1'>Order History</Header>
          <Table unstackable basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order no.</Table.HeaderCell>
                <Table.HeaderCell>Order date</Table.HeaderCell>
                <Table.HeaderCell>
                  {userProfile.role === 'producer' ? 'Purchaser' : 'Brewery'}
                </Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell colSpan={3}>
                  <Select
                    options={orderStatuses}
                    placeholder='Filter'
                    onChange={handleSelectChange}
                    defaultValue=''
                    isClearable
                    escapeClearsValue
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {ordersInfo &&
                ordersInfo.businesses &&
                ordersInfo.orders
                  .filter((order) =>
                    statusFilter ? order.status === statusFilter : true,
                  )
                  .map((order, index) => (
                    <React.Fragment key={order._id}>
                      <OrderItem
                        ordersInfo={ordersInfo}
                        order={order}
                        index={index}
                        userProfile={userProfile}
                      />
                    </React.Fragment>
                  ))}
            </Table.Body>
          </Table>
        </Segment>
      </PageWrapper>
    </>
  );
};

export default ProducerOrdersPage;
