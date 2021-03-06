/*
 * OrderPage Constants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const FETCH_ORDER = 'beerlocal/OrderPage/FETCH_ORDER';
export const FETCH_ORDER_SUCCESS = 'beerlocal/OrderPage/FETCH_ORDER_SUCCESS';
export const FETCH_ORDER_ERROR = 'beerlocal/OrderPage/FETCH_ORDER_ERROR';
export const EDIT_ORDER = 'beerlocal/OrderPage/EDIT_ORDER';
export const EDIT_ORDER_SUCCESS = 'beerlocal/OrderPage/EDIT_ORDER_SUCCESS';
export const EDIT_ORDER_ERROR = 'beerlocal/OrderPage/EDIT_ORDER_ERROR';
export const CLEAR_ORDER = 'beerlocal/OrderPage/CLEAR_ORDER';
export const SEND_MESSAGE = 'beerlocal/OrderPage/SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'beerlocal/OrderPage/SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_ERROR = 'beerlocal/OrderPage/SEND_MESSAGE_ERROR';
