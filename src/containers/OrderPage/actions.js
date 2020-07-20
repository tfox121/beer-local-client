/*
 *
 * App actions
 *
 */

import {
  FETCH_ORDER,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_ERROR,
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  EDIT_ORDER_ERROR,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  CLEAR_ORDER,
} from './constants';

export const fetchOrder = (pathName) => ({
  type: FETCH_ORDER,
  pathName,
});

export function orderFetched(order) {
  return {
    type: FETCH_ORDER_SUCCESS,
    order,
  };
}

export function orderFetchError(error) {
  return {
    type: FETCH_ORDER_ERROR,
    error,
  };
}

export const editOrder = (editObj) => ({
  type: EDIT_ORDER,
  editObj,
});

export function orderEdited(order) {
  return {
    type: EDIT_ORDER_SUCCESS,
    order,
  };
}

export function orderEditError(error) {
  return {
    type: EDIT_ORDER_ERROR,
    error,
  };
}

export const sendMessage = (messageContent) => ({
  type: SEND_MESSAGE,
  messageContent,
});

export function messageSent(order) {
  return {
    type: SEND_MESSAGE_SUCCESS,
    order,
  };
}

export function messageSendError(error) {
  return {
    type: SEND_MESSAGE_ERROR,
    error,
  };
}

export function clearOrder() {
  return {
    type: CLEAR_ORDER,
  };
}
