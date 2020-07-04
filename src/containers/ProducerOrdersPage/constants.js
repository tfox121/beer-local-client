/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const FETCH_ORDERS = 'beerlocal/App/FETCH_ORDERS';
export const FETCH_ORDERS_SUCCESS = 'beerlocal/App/FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_ERROR = 'beerlocal/App/FETCH_ORDERS_ERROR';
export const CLEAR_ORDERS = 'beerlocal/App/CLEAR_ORDERS';
