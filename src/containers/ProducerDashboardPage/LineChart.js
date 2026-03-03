import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import moment from 'moment';

import calcOrderTotal from '../../utils/calcOrderTotal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const LineChart = ({
  data, period, step, status,
}) => {
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState([]);

  const [previousDates, setPreviousDates] = useState([]);
  const [previousValues, setPreviousValues] = useState([]);

  function* currentDateRange(periodString, stepString) {
    const today = moment();
    const startDate = moment().subtract(1, periodString).add(1, stepString);

    while (startDate <= today) {
      yield startDate.format();
      startDate.add(1, stepString);
    }
  }

  function* previousDateRange(periodString, stepString) {
    const endDate = moment().subtract(1, periodString).subtract(1, 'day');
    const startDate = moment().subtract(2, periodString).add(1, stepString).subtract(1, 'day');

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
    if (!dates.length) {
      return;
    }
    const orders = Array.isArray(data) ? data : [];
    setValues(mapDatesToTotals(dates, orders, status, step));
    setPreviousValues(mapDatesToTotals(previousDates, orders, status, step));
  }, [data, dates, previousDates, status, step]);

  if (!values.length || !dates.length) {
    return null;
  }

  const labels = dates.map((date) => moment(date).format('YYYY-MM-DD'));

  const dataObj = {
    labels,
    datasets: [
      {
        label: 'Current',
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
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
        tension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#cfcfcf',
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
    year: 'YYYY',
  };

  const maxCurrent = values.length ? Math.max(...values) : 0;
  const maxPrevious = previousValues.length ? Math.max(...previousValues) : 0;
  const suggestedMax = Math.max(maxCurrent, maxPrevious) * 1.01;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `£${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        id: 'y-axis',
        ticks: {
          min: 0,
          maxTicksLimit: 4,
          padding: 10,
          suggestedMax,
          callback: (value) => `£${value}`,
        },
        gridLines: {
          drawBorder: false,
          drawTicks: false,
        },
      },
      x: {
        id: 'x-axis',
        ticks: {
          padding: 5,
          callback: (value) => moment(labels[value]).format(toolTipFormat[step] || 'ddd Do'),
        },
        gridLines: {
          zeroLineWidth: 0.5,
          intersect: false,
        },
      },
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
