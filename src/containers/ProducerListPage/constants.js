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

export const FETCH_USER = 'beerlocal/App/FETCH_USER';
export const FETCH_USER_SUCCESS = 'beerlocal/App/FETCH_USER_SUCCESS';
export const FETCH_USER_ERROR = 'beerlocal/App/FETCH_USER_ERROR';
export const CLEAR_USER = 'beerlocal/App/CLEAR_USER';
