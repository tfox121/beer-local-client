/* eslint-disable no-nested-ternary */

import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import { values } from 'lodash';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Header,
  Segment,
  Button,
  Grid,
  Icon,
  Image,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { TileLayer, Map } from 'react-leaflet';
import PageWrapper from '../../components/PageWrapper';
import ProducerDashboardStyle from './ProducerDashboardStyle';
import calcOrderTotal from '../../utils/calcOrderTotal';
import LineChart from './LineChart';
import {
  PACK_SIZES,
  PRODUCER_CHART_TIME_PERIODS,
  MAP_TILE_PROVIDER_URL,
} from '../../utils/constants';
import DistributionAreaDisplay from '../../components/DistributionAreaDisplay';
import MapMarker from '../../components/MapMarker';
import { useProducerDashboardQuery } from '../../queries/producerDashboard';
import { useUserQuery } from '../../queries/user';
import { tr } from '../../utils/i18nRuntime';
const ProducerDashboardPage = () => {
  const { isAuthenticated } = useAuth0();
  const { data: userProfile } = useUserQuery({
    enabled: isAuthenticated,
  });
  const { data: dashboardData, isLoading: producerDashboardFetching } =
    useProducerDashboardQuery();
  const dashboardOrders = useMemo(
    () => dashboardData?.dashboardOrders || [],
    [dashboardData],
  );
  const dashBoardRetailers = useMemo(
    () => dashboardData?.dashboardRetailers || [],
    [dashboardData],
  );
  const [salesPeriod, setSalesPeriod] = useState('week');
  const [periodSales, setPeriodSales] = useState({});
  const [periodSalesDiff, setPeriodSalesDiff] = useState(0);
  const [periodSalesAverageDiff, setPeriodSalesAverageDiff] = useState(0);
  const [periodSalesOrderCountDiff, setPeriodSalesOrderCountDiff] = useState(0);
  const [periodSalesItemCountDiff, setPeriodSalesItemCountDiff] = useState(0);
  const [periodSalesAverageItemsDiff, setPeriodSalesAverageItemsDiff] =
    useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const status = 'Pending';
  const periodSalesCalc = (ordersArr, period, previous) => {
    let total = 0;
    let orderCount = 0;
    let itemCount = 0;
    ordersArr.forEach((order) => {
      if (
        previous &&
        order.status === status &&
        moment(order.createdAt).isBetween(
          moment().subtract(2, period),
          moment().subtract(1, period),
        )
      ) {
        total += calcOrderTotal(order.items);
        orderCount += 1;
        order.items.forEach((orderItem) => {
          itemCount += orderItem.orderQuant;
        });
      } else if (
        !previous &&
        order.status === status &&
        moment(order.createdAt).isAfter(moment().subtract(1, period))
      ) {
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
      total,
      average,
      orderCount,
      itemCount,
      averageItems,
    };
  };
  const topCustomersArr = (ordersArr, period) => {
    const customerList = ordersArr.reduce((customers, order) => {
      const customersObj = customers;
      if (
        order.status === status &&
        moment(order.createdAt).isAfter(moment().subtract(1, period))
      ) {
        if (!customersObj[order.businessName]) {
          customersObj[order.businessName] = {
            businessName: order.businessName,
            businessId: order.businessId,
            avatarSource: order.avatarSource,
            location: order.location,
            salesTotal: 0,
          };
        }
        customersObj[order.businessName].salesTotal += calcOrderTotal(
          order.items,
        );
      }
      return customersObj;
    }, {});
    return values(customerList).sort((a, b) =>
      a.salesTotal > b.salesTotal ? -1 : a.salesTotal < b.salesTotal ? 1 : 0,
    );
  };
  const topItemsArr = (ordersArr, period) => {
    if (ordersArr.length) {
      const itemList = ordersArr.reduce((items, order) => {
        const itemsObj = items;
        if (
          order.status === status &&
          moment(order.createdAt).isAfter(moment().subtract(1, period))
        ) {
          order.items.forEach((item) => {
            if (!itemsObj[item.id]) {
              itemsObj[item.id] = {
                id: item.id,
                name: item.name,
                packSize: item.packSize,
                imageSource: item.imageSource,
                salesTotal: 0,
              };
            }
            itemsObj[item.id].salesTotal += item.orderQuant * item.price;
          });
        }
        return itemsObj;
      }, {});
      return values(itemList).sort((a, b) =>
        a.salesTotal > b.salesTotal ? -1 : a.salesTotal < b.salesTotal ? 1 : 0,
      );
    }
  };
  useEffect(() => {
    if (dashboardOrders.length) {
      const currentPeriodData = periodSalesCalc(dashboardOrders, salesPeriod);
      const previousPeriodData = periodSalesCalc(
        dashboardOrders,
        salesPeriod,
        true,
      );
      setPeriodSales(currentPeriodData);
      setPeriodSalesDiff(currentPeriodData.total - previousPeriodData.total);
      setPeriodSalesAverageDiff(
        currentPeriodData.average - previousPeriodData.average,
      );
      setPeriodSalesAverageItemsDiff(
        currentPeriodData.averageItems - previousPeriodData.averageItems,
      );
      setPeriodSalesOrderCountDiff(
        currentPeriodData.orderCount - previousPeriodData.orderCount,
      );
      setPeriodSalesItemCountDiff(
        currentPeriodData.itemCount - previousPeriodData.itemCount,
      );
      setTopCustomers(topCustomersArr(dashboardOrders, salesPeriod));
    }
  }, [dashboardOrders, salesPeriod]);
  const topItems = useMemo(
    () => topItemsArr(dashboardOrders, salesPeriod),
    [dashboardOrders, salesPeriod],
  );
  if (
    !userProfile ||
    !Object.keys(dashboardOrders).length ||
    !Object.keys(periodSales).length
  ) {
    return null;
  }

  // const periodOptions = [
  //   { text: 'week', value: 'week' },
  //   { text: 'quarter', value: 'quarter' },
  //   { text: 'month', value: 'month' },
  //   { text: 'year', value: 'year' },
  // ];

  return (
    <PageWrapper>
      {producerDashboardFetching && (
        <Dimmer inverted active page>
          <Loader inverted />
        </Dimmer>
      )}
      <Segment basic className='primary wrapper'>
        <ProducerDashboardStyle>
          <Grid stackable columns={2} verticalAlign='middle'>
            <Grid.Column className='header-column' width='10'>
              <Header as='h1'>
                {tr('containers.producerdashboardpage.index.hi', 'Hi')}
                {userProfile.businessName}
                {', '}
                {tr(
                  'containers.producerdashboardpage.index.here.s.how.things.are.going',
                  "here's how things are going.",
                )}
              </Header>
            </Grid.Column>
            <Grid.Column className='button-column' width='6' textAlign='right'>
              <Button.Group>
                <Button
                  active={salesPeriod === 'week'}
                  onClick={() => setSalesPeriod('week')}
                >
                  {tr('containers.producerdashboardpage.index.week', 'Week')}
                </Button>
                <Button
                  active={salesPeriod === 'month'}
                  onClick={() => setSalesPeriod('month')}
                >
                  {tr('containers.producerdashboardpage.index.month', 'Month')}
                </Button>
                <Button
                  active={salesPeriod === 'year'}
                  onClick={() => setSalesPeriod('year')}
                >
                  {tr('containers.producerdashboardpage.index.year', 'Year')}
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
          <Segment basic>
            <Grid columns={3} stackable>
              <Grid.Column className='sales-summary' width={6}>
                <Header>
                  {tr('containers.producerdashboardpage.index.this', 'This')}
                  {salesPeriod}
                  {tr(
                    'containers.producerdashboardpage.index.you.ve.sold',
                    "you've sold",
                  )}
                </Header>
                <Header as='h1' dividing>
                  £{periodSales.total.toFixed(2)}
                </Header>
                {tr('containers.producerdashboardpage.index.that.s', "That's")}{' '}
                {periodSalesDiff === 0 ? (
                  tr(
                    'containers.producerdashboardpage.index.exactly.the.same.as',
                    'exactly the same as',
                  )
                ) : (
                  <>
                    £{Math.abs(periodSalesDiff).toFixed(2)}{' '}
                    {periodSalesDiff > 0 ? 'more' : 'less'} than
                  </>
                )}{' '}
                last {salesPeriod}
                {periodSalesDiff >= 0 ? '!' : '.'}
                <Header as='h3' dividing>
                  {periodSales.orderCount} orders
                </Header>
                That&apos;s{' '}
                {periodSalesOrderCountDiff === 0 ? (
                  tr(
                    'containers.producerdashboardpage.index.exactly.the.same.as.2',
                    'exactly the same as',
                  )
                ) : (
                  <>
                    {Math.abs(periodSalesOrderCountDiff)}{' '}
                    {periodSalesOrderCountDiff > 0 ? 'more' : 'fewer'} than
                  </>
                )}{' '}
                last {salesPeriod}
                {periodSalesOrderCountDiff >= 0 ? '!' : '.'}
                <Header as='h3' dividing>
                  {periodSales.itemCount} items
                </Header>
                That&apos;s{' '}
                {periodSalesItemCountDiff === 0 ? (
                  'exactly the same as'
                ) : (
                  <>
                    {Math.abs(periodSalesItemCountDiff)}{' '}
                    {periodSalesItemCountDiff > 0 ? 'more' : 'fewer'} than
                  </>
                )}{' '}
                last {salesPeriod}
                {periodSalesItemCountDiff >= 0 ? '!' : '.'}
              </Grid.Column>
              <Grid.Column width={7}>
                <Segment>
                  <LineChart
                    data={dashboardOrders}
                    period={salesPeriod}
                    step={PRODUCER_CHART_TIME_PERIODS[salesPeriod]}
                    status={status}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column className='sales-averages' width={3}>
                <Header as='h5' className='top-level'>
                  {tr(
                    'containers.producerdashboardpage.index.average.sale.value',
                    'Average Sale Value',
                  )}
                </Header>
                <Header>
                  {!Number.isNaN(periodSales.average)
                    ? `£${periodSales.average.toFixed(2)}`
                    : tr(
                        'containers.producerdashboardpage.index.no.sales.to.go.on',
                        'No sales to go on!',
                      )}
                </Header>
                {!Number.isNaN(periodSalesAverageDiff) && (
                  <>
                    {periodSalesAverageDiff === 0 ? (
                      'Exactly the same as'
                    ) : (
                      <>
                        £{Math.abs(periodSalesAverageDiff).toFixed(2)}{' '}
                        {periodSalesAverageDiff > 0 ? 'more' : 'less'} than
                      </>
                    )}{' '}
                    last {salesPeriod}
                    {periodSalesAverageDiff >= 0 ? '!' : '.'}
                  </>
                )}
                <Header as='h5' className='top-level'>
                  {tr(
                    'containers.producerdashboardpage.index.average.items.per.sale',
                    'Average Items per Sale',
                  )}
                </Header>
                <Header>
                  {!Number.isNaN(periodSales.averageItems)
                    ? periodSales.averageItems.toFixed(1)
                    : 'No sales to go on!'}
                </Header>
                {!Number.isNaN(periodSalesAverageItemsDiff) && (
                  <>
                    {periodSalesAverageItemsDiff === 0 ? (
                      'Exactly the same as'
                    ) : (
                      <>
                        {Math.abs(periodSalesAverageItemsDiff).toFixed(1)}{' '}
                        {periodSalesAverageItemsDiff > 0 ? 'more' : 'fewer'}{' '}
                        than
                      </>
                    )}{' '}
                    last {salesPeriod}
                    {periodSalesAverageItemsDiff >= 0 ? '!' : '.'}
                  </>
                )}
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment>
            <Header dividing>
              {tr(
                'containers.producerdashboardpage.index.top.customers',
                'Top Customers',
              )}
            </Header>
            <Grid columns={2}>
              {topCustomers.length ? (
                topCustomers.map((customer) => (
                  <Grid.Row key={customer.businessId}>
                    <Grid.Column width={12}>
                      <Image
                        style={{
                          marginRight: '0.5em',
                        }}
                        avatar
                        bordered
                        centered
                        src={
                          customer.avatarSource ||
                          '/images/avatars/blank-avatar.webp'
                        }
                        alt='user avatar'
                      />
                      <Link to={`/brewery/${customer.businessId}`}>
                        {customer.businessName}
                      </Link>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      £{customer.salesTotal.toFixed(2)}
                    </Grid.Column>
                  </Grid.Row>
                ))
              ) : (
                <Grid.Row>
                  <Grid.Column width={16}>
                    {tr(
                      'containers.producerdashboardpage.index.no.customers.so.far.this',
                      'No customers so far this',
                    )}
                    {salesPeriod}.
                  </Grid.Column>
                </Grid.Row>
              )}
            </Grid>
          </Segment>
          <Segment>
            <Header dividing>
              {tr(
                'containers.producerdashboardpage.index.top.items',
                'Top Items',
              )}
            </Header>
            <Grid columns={2} verticalAlign='middle'>
              {topItems.length ? (
                topItems.map((item) => (
                  <Grid.Row key={item.id}>
                    <Grid.Column width={8}>
                      <Image
                        style={{
                          marginRight: '0.5em',
                        }}
                        avatar
                        bordered
                        centered
                        src={
                          item.imageSource ||
                          '/images/products/blank-product.png'
                        }
                        alt='product'
                      />
                      {item.name}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      {PACK_SIZES[item.packSize]}
                    </Grid.Column>
                    <Grid.Column width={4}>
                      £{item.salesTotal.toFixed(2)}
                    </Grid.Column>
                  </Grid.Row>
                ))
              ) : (
                <Grid.Row>
                  <Grid.Column width={16}>
                    {tr(
                      'containers.producerdashboardpage.index.no.items.sold.so.far.this',
                      'No items sold so far this',
                    )}
                    {salesPeriod}.
                  </Grid.Column>
                </Grid.Row>
              )}
            </Grid>
          </Segment>
          <Segment>
            <Map
              className='profileViewMap'
              center={userProfile.location}
              zoom={6}
              zoomControl={false}
              style={{
                height: '400px',
              }}
            >
              <TileLayer url={MAP_TILE_PROVIDER_URL} />
              <DistributionAreaDisplay
                distributionAreas={userProfile.distributionAreas}
              />
              <MapMarker location={userProfile.location} />
              {topCustomers.map((customer) => (
                <MapMarker
                  key={customer.businessName}
                  type='customer'
                  location={customer.location}
                  name={customer.businessName}
                />
              ))}
              {dashBoardRetailers
                .filter(
                  (customer) =>
                    !topCustomers
                      .map((customerObj) => customerObj.businessName)
                      .includes(customer.businessName),
                )
                .map((customer) => (
                  <MapMarker
                    key={customer.businessName}
                    type='not-customer'
                    location={customer.location}
                    name={customer.businessName}
                  />
                ))}
            </Map>
            <Icon
              style={{
                marginTop: '1em',
              }}
              color='blue'
              name='map marker alternate'
            />
            {tr(
              'containers.producerdashboardpage.index.current.customers',
              '- current customers',
            )}
            <Icon color='red' name='map marker alternate' />
            {tr(
              'containers.producerdashboardpage.index.potential.customers',
              '- potential customers',
            )}
          </Segment>
        </ProducerDashboardStyle>
      </Segment>
    </PageWrapper>
  );
};
export default ProducerDashboardPage;
