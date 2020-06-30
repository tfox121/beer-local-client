/**
 *
 * Tests for ImageUpload
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import ImageUpload from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<ImageUpload />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');

    const formValues = {
      pictureFile: {
        name: 'TestFile.png',
      },
    };

    const formErrors = {
      pictureFile: false,
    };

    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <ImageUpload formValues={formValues} formErrors={formErrors} />
      </IntlProvider>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

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
        <ImageUpload />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
