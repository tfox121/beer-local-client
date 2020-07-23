/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { createStructuredSelector } from 'reselect';
import {
  Header, Segment, Button, Modal, Form, Grid, Message, Feed, Accordion, Icon, Divider, Image, Card,
} from 'semantic-ui-react';
import { Helmet } from 'react-helmet';
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

const ProducerDashboardPage = ({
  userProfile,
}) => {
  useInjectReducer({ key: 'ProducerDashboardPage', reducer });
  useInjectSaga({ key: 'ProducerDashboardPage', saga });

  const [orders, setOrders] = useState({});

  const getDatedTotals = (orderArr, status, format) => (
    orderArr.reduce((groups, orderItem) => {
      const date = moment(orderItem.createdAt).format(format);
      if (orderItem.status === status) {
        if (!groups[date]) {
          groups[date] = 0;
        }
        groups[date] += calcOrderTotal(orderItem.items);
        return groups;
      }
      return groups;
    }, {})
  );

  useEffect(() => {
    const getOrders = async () => {
      const privateRoute = await getPrivateRoute();
      const response = await privateRoute.get('/orders');
      console.log(response.data);
      const grouped = getDatedTotals(response.data.orders, 'Pending', 'DD/MM/YYYY');
      console.log('GROUPED', grouped);
      setOrders(grouped);
    };
    getOrders();
  }, []);

  const data = {
    labels: Object.keys(orders),
    datasets: [
      {
        // label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        yAxisID: 'y-axis',
        data: Object.values(orders),
      },
    ],
  };

  const options = {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Sales per day',
    },
    scales: {
      yAxes: [{
        id: 'y-axis',
        ticks: {
          beginAtZero: true,
          suggestedMax: Object.values(orders).reduce((a, b) => Math.max(a, b), 0) * 1.5,
          callback(value) {
            return `£${value}`;
          },
        },
      }],
    },
  };

  return (
    <>
      <Helmet>
        <title>beerLocal - Updates</title>
        <meta name="description" content="Retailer dashboard" />
      </Helmet>
      <PageWrapper>
        <Segment basic className="primary wrapper">
          <Header as="h1">Dashboard</Header>
          <ProducerDashboardStyle>
            <Card>
              <Line data={data} options={options} />
            </Card>
            <Card>
              <Line data={data} options={options} />
            </Card>
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
