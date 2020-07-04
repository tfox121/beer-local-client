/**
 *
 * PageWrapper
 *
 */

import styled from 'styled-components';
import React from 'react';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const PageWrapperStyle = styled.div`
  min-height: calc(100vh - 49px);
  div.ui.text.loader {
    min-height: 100%;
  }
  padding: 1em;
`;

const PageWrapper = ({ children }) => (
  <PageWrapperStyle>
    <Container>
      {children}
    </Container>
  </PageWrapperStyle>
);

PageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

export default PageWrapper;
