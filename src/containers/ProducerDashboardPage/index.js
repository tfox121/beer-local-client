/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import Masonry from 'react-masonry-css';
import { merge, pick, values } from 'lodash';
import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Button, Modal, Form, Grid, Message, Feed, Accordion, Icon, Divider, Image, Card, Dropdown,
} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { TileLayer, Map } from 'react-leaflet';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

import PageWrapper from '../../components/PageWrapper';
import { makeSelectUser } from '../App/selectors';
import { getPrivateRoute } from '../../utils/api';
import timeAgo from '../../utils/timeAgo';
import ProducerDashboardStyle from './ProducerDashboardStyle';
import calcOrderTotal from '../../utils/calcOrderTotal';
import LineChart from './LineChart';
import { PACK_SIZES } from '../../utils/constants';
import MapStyle from '../ProducerProfilePage/MapStyle';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';

const ProducerDashboardPage = ({
  userProfile,
}) => {
  useInjectReducer({ key: 'ProducerDashboardPage', reducer });
  useInjectSaga({ key: 'ProducerDashboardPage', saga });

  const [orders, setOrders] = useState({});
  const [salesPeriod, setSalesPeriod] = useState('week');
  const [periodSales, setPeriodSales] = useState({});
  const [periodSalesDiff, setPeriodSalesDiff] = useState(0);
  const [periodSalesAverageDiff, setPeriodSalesAverageDiff] = useState(0);
  const [periodSalesOrderCountDiff, setPeriodSalesOrderCountDiff] = useState(0);
  const [periodSalesItemCountDiff, setPeriodSalesItemCountDiff] = useState(0);
  const [periodSalesAverageItemsDiff, setPeriodSalesAverageItemsDiff] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [potentialCustomers, setPotentialCustomers] = useState([]);

  const status = 'Pending';

  useEffect(() => {
    const getOrders = async () => {
      const privateRoute = await getPrivateRoute();
      let response = await privateRoute.get('/orders');
      console.log(merge(response.data.orders, response.data.businesses.map((business) => pick(business, ['businessName', 'businessId', 'avatarSource', 'location']))));
      setOrders(merge(response.data.orders, response.data.businesses.map((business) => pick(business, ['businessName', 'businessId', 'avatarSource', 'location']))));
      response = await privateRoute.get('/producer/retailers');
      console.log('RETAILERS', response.data.retailers);
      setPotentialCustomers(response.data.retailers);
    };
    getOrders();
  }, []);

  const periodSalesCalc = (ordersArr, period, previous) => {
    let total = 0;
    let orderCount = 0;
    let itemCount = 0;

    ordersArr.forEach((order) => {
      if (order.status === status && moment(order.createdAt).isSame(previous ? moment().subtract(1, period) : moment(), period)) {
        total += calcOrderTotal(order.items);
        orderCount += 1;
        order.items.forEach((orderItem) => {
          itemCount += orderItem.orderQuant;
        });
      }
    });
    const average = total / orderCount;
    const averageItems = itemCount / orderCount;
    return {
      total, average, orderCount, itemCount, averageItems,
    };
  };

  const topCustomersArr = (ordersArr, period) => {
    const customerList = ordersArr.reduce((customers, order) => {
      if (order.status === status && moment(order.createdAt).isSame(moment(), period)) {
        if (!customers[order.businessName]) {
          customers[order.businessName] = {
            businessName: order.businessName,
            businessId: order.businessId,
            avatarSource: order.avatarSource,
            location: order.location,
            salesTotal: 0,
          };
        }
        customers[order.businessName].salesTotal += calcOrderTotal(order.items);
      }
      return customers;
    }, {});
    return values(customerList).sort((a, b) => (a.salesTotal > b.salesTotal) ? -1 : ((a.salesTotal < b.salesTotal) ? 1 : 0));
  };

  const topItemsArr = (ordersArr, period) => {
    const itemList = ordersArr.reduce((items, order) => {
      if (order.status === status && moment(order.createdAt).isSame(moment(), period)) {
        order.items.forEach((item) => {
          if (!items[item.id]) {
            items[item.id] = {
              id: item.id,
              name: item.name,
              packSize: item.packSize,
              imageSource: item.imageSource,
              salesTotal: 0,
            };
          }
          items[item.id].salesTotal += (item.orderQuant * item.price);
        });
      }
      return items;
    }, {});
    return values(itemList).sort((a, b) => (a.salesTotal > b.salesTotal) ? -1 : ((a.salesTotal < b.salesTotal) ? 1 : 0));
  };

  useEffect(() => {
    if (orders.length) {
      const currentPeriodData = periodSalesCalc(orders, salesPeriod);
      const previousPeriodData = periodSalesCalc(orders, salesPeriod, true);
      setPeriodSales(currentPeriodData);
      setPeriodSalesDiff(currentPeriodData.total - previousPeriodData.total);
      setPeriodSalesAverageDiff(currentPeriodData.average - previousPeriodData.average);
      setPeriodSalesAverageItemsDiff(currentPeriodData.averageItems - previousPeriodData.averageItems);
      setPeriodSalesOrderCountDiff(currentPeriodData.orderCount - previousPeriodData.orderCount);
      setPeriodSalesItemCountDiff(currentPeriodData.itemCount - previousPeriodData.itemCount);
      setTopCustomers(topCustomersArr(orders, salesPeriod));
    }
  }, [orders, salesPeriod]);

  if (!Object.keys(orders).length || !Object.keys(periodSales).length) {
    return null;
  }

  const step = {
    year: 'quarter',
    quarter: 'month',
    month: 'week',
    week: 'day',
  };

  // const periodOptions = [
  //   { text: 'week', value: 'week' },
  //   { text: 'quarter', value: 'quarter' },
  //   { text: 'month', value: 'month' },
  //   { text: 'year', value: 'year' },
  // ];

  return (
    <>
      <Helmet>
        <title>beerLocal - Dashboard</title>
        <meta name="description" content="Producer dashboard" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <ProducerDashboardStyle>
            <Grid columns={2} verticalAlign="middle">
              <Grid.Column width="10">
                <Header as="h1">
                  Hi
                  {' '}
                  {userProfile.businessName}
                  {', '}
                  here&apos;s how things are going.
                </Header>
              </Grid.Column>
              <Grid.Column width="6" textAlign="right">
                <Button.Group>
                  <Button active={salesPeriod === 'week'} onClick={() => setSalesPeriod('week')}>Week</Button>
                  <Button active={salesPeriod === 'month'} onClick={() => setSalesPeriod('month')}>Month</Button>
                  <Button active={salesPeriod === 'year'} onClick={() => setSalesPeriod('year')}>Year</Button>
                </Button.Group>
              </Grid.Column>
            </Grid>
            <Segment basic padded>
              <Grid columns={3}>
                <Grid.Column className="sales-summary" width={6}>
                  <Header>
                    This
                    {' '}
                    {salesPeriod}
                    {' '}
                    you&apos;ve sold
                  </Header>
                  <Header as="h1" dividing>
                    £
                    {periodSales.total.toFixed(2)}
                  </Header>
                  That&apos;s
                  {' '}
                  {periodSalesDiff === 0 ? 'exactly the same as' : (
                    <>
                      £
                      {Math.abs(periodSalesDiff).toFixed(2)}
                      {' '}
                      {periodSalesDiff > 0 ? 'more' : 'less'}
                      {' '}
                      than
                    </>
                  )}
                  {' '}
                  last
                  {' '}
                  {salesPeriod}
                  {periodSalesDiff >= 0 ? '!' : '.'}
                  <Header as="h3" dividing>
                    {periodSales.orderCount}
                    {' '}
                    orders
                  </Header>
                  That&apos;s
                  {' '}
                  {periodSalesOrderCountDiff === 0 ? 'exactly the same as' : (
                    <>
                      {Math.abs(periodSalesOrderCountDiff)}
                      {' '}
                      {periodSalesOrderCountDiff > 0 ? 'more' : 'less'}
                      {' '}
                      than
                    </>
                  )}
                  {' '}
                  last
                  {' '}
                  {salesPeriod}
                  {periodSalesOrderCountDiff >= 0 ? '!' : '.'}
                  <Header as="h3" dividing>
                    {periodSales.itemCount}
                    {' '}
                    items
                  </Header>
                  That&apos;s
                  {' '}
                  {periodSalesItemCountDiff === 0 ? 'exactly the same as' : (
                    <>
                      {Math.abs(periodSalesItemCountDiff)}
                      {' '}
                      {periodSalesItemCountDiff > 0 ? 'more' : 'less'}
                      {' '}
                      than
                    </>
                  )}
                  {' '}
                  last
                  {' '}
                  {salesPeriod}
                  {periodSalesItemCountDiff >= 0 ? '!' : '.'}
                </Grid.Column>
                <Grid.Column width={7}>
                  <Segment>
                    {/* <Header>
                      <Dropdown inline options={periodOptions} value={salesPeriod} onChange={(e, { value }) => setSalesPeriod(value)} />
                    </Header> */}
                    <LineChart data={orders} period={salesPeriod} step={step[salesPeriod]} status={status} />
                  </Segment>
                </Grid.Column>
                <Grid.Column className="sales-averages" width={3}>
                  <Header as="h5">
                    Average Sale Value
                  </Header>
                  <Header>
                    £
                    {periodSales.average.toFixed(2)}
                  </Header>
                  {!Number.isNaN(periodSalesAverageDiff) && (
                    <>
                      {periodSalesAverageDiff === 0 ? 'Exactly the same as' : (
                        <>
                          £
                          {Math.abs(periodSalesAverageDiff).toFixed(2)}
                          {' '}
                          {periodSalesAverageDiff > 0 ? 'more' : 'less'}
                          {' '}
                          than
                        </>
                      )}
                      {' '}
                      last
                      {' '}
                      {salesPeriod}
                      {periodSalesAverageDiff >= 0 ? '!' : '.'}
                    </>
                  )}
                  <Header as="h5">
                    Average Items per Sale
                  </Header>
                  <Header>
                    {periodSales.averageItems}
                  </Header>
                  {!Number.isNaN(periodSalesAverageItemsDiff) && (
                    <>
                      {periodSalesAverageItemsDiff === 0 ? 'Exactly the same as' : (
                        <>
                          {Math.abs(periodSalesAverageItemsDiff)}
                          {' '}
                          {periodSalesAverageItemsDiff > 0 ? 'more' : 'less'}
                          {' '}
                          than
                        </>
                      )}
                      {' '}
                      last
                      {' '}
                      {salesPeriod}
                      {periodSalesAverageItemsDiff >= 0 ? '!' : '.'}
                    </>
                  )}
                </Grid.Column>
              </Grid>
            </Segment>
            <Segment>
              <Header dividing>
                Top Customers
              </Header>
              <Grid columns={2}>
                {topCustomers.map((customer) => (
                  <Grid.Row key={customer.businessId}>
                    <Grid.Column width={12}>
                      <Image style={{ marginRight: '0.5em' }} avatar bordered centered src={customer.avatarSource || '/images/avatars/blank-avatar.webp'} alt="user avatar" />
                      <Link to={`/brewery/${customer.businessId}`}>{customer.businessName}</Link>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      £
                      {customer.salesTotal.toFixed(2)}
                    </Grid.Column>
                  </Grid.Row>
                ))}
              </Grid>
            </Segment>
            <Segment>
              <Header dividing>
                Top Items
              </Header>
              <Grid columns={2} verticalAlign="middle">
                {topItemsArr(orders, salesPeriod).map((item) => (
                  <Grid.Row key={item.id}>
                    <Grid.Column width={8}>
                      <Image style={{ marginRight: '0.5em' }} avatar bordered centered src={item.imageSource || '/images/products/blank-product.png'} alt="product" />
                      {item.name}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {PACK_SIZES[item.packSize]}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      £
                      {item.salesTotal.toFixed(2)}
                    </Grid.Column>
                  </Grid.Row>
                ))}
              </Grid>
            </Segment>
            <Segment>
              <Map
                className="profileViewMap"
                center={userProfile.location}
                zoom={6}
                zoomControl={false}
                style={{
                  height: '400px',
                }}
              >
                <TileLayer
                  url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                />
                <DistributionAreaDisplay
                  distributionAreas={userProfile.distributionAreas}
                />
                <MapMarker location={userProfile.location} />
                {topCustomers.map((customer) => (
                  <MapMarker type="customer" location={customer.location} name={customer.businessName} />
                ))}
                {potentialCustomers.filter((customer) => !topCustomers.map((customerObj) => customerObj.businessName).includes(customer.businessName)).map((customer) => (
                  <MapMarker type="not-customer" location={customer.location} name={customer.businessName} />
                ))}
              </Map>
              <Icon color="blue" name="map marker alternate" />
              - current customers
              {' '}
              <Icon color="red" name="map marker alternate" />
              - potential customers
            </Segment>
          </ProducerDashboardStyle>
        </Segment>
      </PageWrapper>
    </>
  );
};

ProducerDashboardPage.propTypes = {
  userProfile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUser(),
});

// function mapDispatchToProps(dispatch) {
//   return {
//   };
// }

const withConnect = connect(
  mapStateToProps,
  // mapDispatchToProps,
);

export default compose(
  withConnect,
)(ProducerDashboardPage);
