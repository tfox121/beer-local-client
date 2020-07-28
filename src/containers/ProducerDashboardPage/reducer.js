import produce from 'immer';
import { merge, pick } from 'lodash';
import {
  FETCH_PRODUCER_DASHBOARD,
  FETCH_PRODUCER_DASHBOARD_SUCCESS,
  FETCH_PRODUCER_DASHBOARD_ERROR,
} from './constants';

export const initialState = {
  fetchingProducerDashboard: false,
  fetchingProducerDashboardError: false,
  dashboardOrders: false,
  dashboardRetailers: false,
};

/* eslint-disable default-case, no-param-reassign */
const ProducerDashboardPageReducer = (state = initialState, action) => produce(state, (draftState) => {
  switch (action.type) {
    default:
      break;
    case FETCH_PRODUCER_DASHBOARD:
      draftState.fetchingProducerDashboardError = false;
      draftState.fetchingProducerDashboard = true;
      break;
    case FETCH_PRODUCER_DASHBOARD_SUCCESS:
      if (action.producerDashboard) {
        const orders = merge(action.producerDashboard.orders.orders, action.producerDashboard.orders.businesses.map((business) => pick(business, ['businessName', 'businessId', 'avatarSource', 'location'])));
        const { retailers } = action.producerDashboard.retailers;
        draftState.dashboardOrders = orders;
        draftState.dashboardRetailers = retailers;
        draftState.fetchingProducerDashboardError = false;
      }
      draftState.fetchingProducerDashboard = false;
      break;
    case FETCH_PRODUCER_DASHBOARD_ERROR:
      if (action.error) {
        draftState.fetchingProducerDashboardError = action.error;
      } else {
        draftState.fetchingProducerDashboardError = true;
      }
      draftState.fetchingProducerDashboard = false;
      break;
  }
});

export default ProducerDashboardPageReducer;
