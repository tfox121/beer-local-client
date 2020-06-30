/**
 *
 * Tests for CreateProfilePage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import { CreateProfilePage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<CreateProfilePage />', () => {
  // it('Expect to not log errors in console', () => {
  //   const spy = jest.spyOn(global.console, 'error');
  //   const dispatch = jest.fn();

  //   const createProfilePage = {
  //     savingUser: false,
  //   };
  //   render(
  //     <IntlProvider locale={DEFAULT_LOCALE}>
  //       <CreateProfilePage
  //         createProfilePage={createProfilePage}
  //         dispatch={dispatch}
  //       />
  //     </IntlProvider>,
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
        <CreateProfilePage />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
