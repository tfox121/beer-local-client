/**
 *
 * Tests for MapMarker
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import MapMarker from '../index';

describe('<MapMarker />', () => {
  // it('Expect to not log errors in console', () => {
  //   const spy = jest.spyOn(global.console, 'error');
  //   render(<MapMarker location={{ lat: 51.1273626, lng: -1.5518375 }} />);
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
    } = render(<MapMarker />);
    expect(firstChild).toMatchSnapshot();
  });
});
