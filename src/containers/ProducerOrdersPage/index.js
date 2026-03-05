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
import { tr } from '../../utils/i18nRuntime';
const ProducerOrdersPage = () => {
  const { isAuthenticated } = useAuth0();
  const { data: userProfile } = useUserQuery({
    enabled: isAuthenticated,
  });
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
        statuses.map((status) => ({
          label: status,
          value: status,
        })),
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
        <title>
          {tr(
            'containers.producerorderspage.index.beerlocal.order.history',
            'BeerLocal - Order History',
          )}
        </title>
        <meta
          name='description'
          content={tr(
            'containers.producerorderspage.index.your.orders',
            'Your orders',
          )}
        />
      </Helmet>
      <PageWrapper>
        <Segment basic className='primary wrapper'>
          <Header as='h1'>
            {tr(
              'containers.producerorderspage.index.order.history',
              'Order History',
            )}
          </Header>
          <Table unstackable basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {tr(
                    'containers.producerorderspage.index.order.no',
                    'Order no.',
                  )}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {tr(
                    'containers.producerorderspage.index.order.date',
                    'Order date',
                  )}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {userProfile.role === 'producer'
                    ? tr(
                        'containers.producerorderspage.index.purchaser',
                        'Purchaser',
                      )
                    : tr(
                        'containers.producerorderspage.index.brewery',
                        'Brewery',
                      )}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {tr('containers.producerorderspage.index.total', 'Total')}
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={3}>
                  <Select
                    options={orderStatuses}
                    placeholder={tr(
                      'containers.producerorderspage.index.filter',
                      'Filter',
                    )}
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
