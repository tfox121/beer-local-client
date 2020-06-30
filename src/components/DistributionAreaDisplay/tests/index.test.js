/**
 *
 * Tests for DistributionAreaDisplay
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
// import 'jest-dom/extend-expect'; // add some helpful assertions

import DistributionAreaDisplay from '../index';

describe('<DistributionAreaDisplay />', () => {
  // it('Expect to not log errors in console', () => {
  //   const distributionAreas = {
  //     type: 'FeatureCollection',
  //     features: [
  //       {
  //         type: 'Feature',
  //         properties: {},
  //         geometry: {
  //           type: 'Polygon',
  //           coordinates: [
  //             ['-1.589964', '53.732463'],
  //             ['-2.568007', '53.455078'],
  //             ['-2.491083', '52.964434'],
  //             ['-1.029512', '52.931303'],
  //             ['-1.013028', '53.425601'],
  //             ['-1.589964', '53.732463'],
  //           ],
  //         },
  //       },
  //     ],
  //   };

  //   const spy = jest.spyOn(global.console, 'error');
  //   render(<DistributionAreaDisplay distributionAreas={distributionAreas} />);
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
    } = render(<DistributionAreaDisplay />);
    expect(firstChild).toMatchSnapshot();
  });
});
