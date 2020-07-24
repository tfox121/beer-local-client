import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

import calcOrderTotal from '../../utils/calcOrderTotal';

const LineChart = ({
  data, period, step, status,
}) => {
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);

  const [previousDates, setPreviousDates] = useState([]);
  const [previousValues, setPreviousValues] = useState([]);

  function* currentDateRange(periodString, stepString) {
    const today = moment();
    const startDate = moment().subtract(1, periodString);

    while (startDate <= today) {
      yield startDate.format();
      startDate.add(1, stepString);
    }
  }

  function* previousDateRange(periodString, stepString) {
    const endDate = moment().subtract(1, periodString).subtract(1, 'day');
    const startDate = moment().subtract(2, periodString).subtract(1, 'day');

    while (startDate <= endDate) {
      yield startDate.format();
      startDate.add(1, stepString);
    }
  }

  const mapDatesToTotals = (datesArr, orders, statusString, stepString) => datesArr.map((date) => {
    let stepTotal = 0;
    orders.forEach((orderItem) => {
      if (orderItem.status === statusString && moment(orderItem.createdAt).isSame(date, stepString)) {
        stepTotal += calcOrderTotal(orderItem.items);
      }
    });
    return stepTotal;
  });

  useEffect(() => {
    if (period && step) {
      setDates([...currentDateRange(period, step)]);
      setPreviousDates([...previousDateRange(period, step)]);
    }
  }, [period, step]);

  useEffect(() => {
    if (data && data.length && dates.length) {
      const mappedDates = mapDatesToTotals(dates, data, status, step);
      console.log('MAPPED', mappedDates);
      setValues(mappedDates);
      setPreviousValues(mapDatesToTotals(previousDates, data, status, step));
    }
  }, [data, dates]);

  if (!values.length || !dates.length) {
    return null;
  }

  const dataObj = {
    labels: dates,
    datasets: [
      {
        label: 'Current',
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
        pointRadius: 3,
        pointHitRadius: 10,
        spanGaps: true,
        xAxisID: 'x-axis',
        yAxisID: 'y-axis',
        data: values,
      },
      {
        label: `Last ${period}`,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#cfcfcf',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#cfcfcf',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#cfcfcf',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        spanGaps: true,
        xAxisID: 'x-axis',
        yAxisID: 'y-axis',
        data: previousValues,
      },
    ],
  };

  const toolTipFormat = {
    day: 'ddd Do',
    week: '[Week from] Do MMM',
    month: 'MMM YYYY',
    quarter: '[Q]Q \'YY',
  };

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        id: 'y-axis',
        ticks: {
          maxTicksLimit: 4,
          padding: 10,
          suggestedMax: Math.max(values.reduce((a, b) => Math.max(a, b)), previousValues.reduce((a, b) => Math.max(a, b))) * 1.01,
          callback(value) {
            return `£${value}`;
          },
        },
        gridLines: {
          drawBorder: false,
          drawTicks: false,
        },
      }],
      xAxes: [{
        id: 'x-axis',
        type: 'time',
        time: {
          isoWeekday: true,
          unit: step,
          tooltipFormat: toolTipFormat[step],
          displayFormats: {
            day: 'ddd Do',
            week: 'Do MMM',
            quarter: '[Q]Q \'YY',
          },
        },
        ticks: {
          padding: 5,
          // min: moment(dates[0]).subtract(1, 'week').format(),
        },
        gridLines: {
          zeroLineWidth: 0.5,
          intersect: false,
        },
      }],
    },
  };
  return (
    <Line data={dataObj} height={200} options={options} />
  );
};

LineChart.propTypes = {
  data: PropTypes.array,
  period: PropTypes.string,
  step: PropTypes.string,
  status: PropTypes.string,
};

export default LineChart;
