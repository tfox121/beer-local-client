/**
 *
 * Tests for ProducerProfilePage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
// import 'jest-dom/extend-expect'; // add some helpful assertions
// import { ConnectedRouter } from 'connected-react-router';

// import history from '../../../utils/history';

import { ProducerProfilePage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

describe('<ProducerProfilePage />', () => {
  // it('Expect to not log errors in console', () => {
  //   const spy = jest.spyOn(global.console, 'error');
  //   const dispatch = jest.fn();

  //   const producerProfilePage = {
  //     profile: {
  //       avatarSource:
  //         '/images/avatars/google-oauth2|111022946565379782477-profile.png',
  //       businessName: 'Test Brewery',
  //       distributionAreas: {
  //         type: 'FeatureCollection',
  //         features: [
  //           {
  //             type: 'Feature',
  //             properties: {},
  //             geometry: {
  //               type: 'Polygon',
  //               coordinates: [
  //                 [
  //                   ['-1.589964', '53.732463'],
  //                   ['-2.568007', '53.455078'],
  //                   ['-2.491083', '52.964434'],
  //                   ['-1.029512', '52.931303'],
  //                   ['-1.013028', '53.425601'],
  //                   ['-1.589964', '53.732463'],
  //                 ],
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //       intro:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc euismod vulputate justo, eu malesuada metus. Praesent ut risus at nisi laoreet sodales. Morbi dolor mi, egestas eget ornare nec, sollicitudin dapibus lectus. Praesent placerat lorem dui, vel venenatis diam venenatis vel. Sed eu faucibus ligula. Cras nec porttitor sapien, ac porttitor lectus. Mauris justo velit, pellentesque eu lectus et, pellentesque laoreet quam.',
  //       location: {
  //         lat: '51.1273626',
  //         lng: '-1.5518375',
  //       },
  //       businessId: 'testbrewery',
  //       salesContactNumber: '07540889237',
  //       salesEmail: 'test@gmail.com',
  //       stock: [],
  //       sub: 'google-oauth2|111022946565379782477',
  //       terms: true,
  //       website: 'testbrewery.co.uk',
  //     },
  //   };
  //   render(
  //     <IntlProvider locale={DEFAULT_LOCALE}>
  //       <ConnectedRouter history={history}>
  //         <ProducerProfilePage
  //           dispatch={dispatch}
  //           producerProfilePage={producerProfilePage}
  //         />
  //       </ConnectedRouter>
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
        <ProducerProfilePage />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
