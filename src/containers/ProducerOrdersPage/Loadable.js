/**
 *
 * Asynchronously loads the component for ProducerProfilePage
 *
 */

import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import loadable from '../../utils/loadable';

export default loadable(() => import('./index'), {
  fallback: (
    <Dimmer active inverted page>
      <Loader />
    </Dimmer>
  ),
});
