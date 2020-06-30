/**
 *
 * Asynchronously loads the component for ProducerProfilePage
 *
 */

import loadable from '../../utils/loadable';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default loadable(() => import('./index'), {
  fallback: (
    <Dimmer active inverted page>
      <Loader />
    </Dimmer>
  ),
});
