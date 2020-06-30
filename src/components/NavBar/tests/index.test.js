/**
 *
 * Tests for NavBar
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
// import Provider from 'react-redux';
// import ShallowRenderer from 'react-test-renderer/shallow';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

// import configureStore from '../../../configureStore';
// import history from '../../../utils/history';

import NavBar from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

// const initialState = {};
// const store = configureStore(initialState, history);

describe('<NavBar />', () => {
  // it('Expect to not log errors in console', () => {
  //   const spy = jest.spyOn(global.console, 'error');
  //   render(
  //     <Provider store={store}>
  //       <IntlProvider locale={DEFAULT_LOCALE}>
  //         <NavBar />
  //       </IntlProvider>
  //     </Provider>,
  //   );
  //   expect(spy).not.toHaveBeenCalled();
  // });

  // it('Expect to have additional unit tests specified', () => {
  //   expect(true).toEqual(false);
  // });

  /**
   * Unskip this test to use it
   *
   * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
   */
  it.skip('Should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <NavBar />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
