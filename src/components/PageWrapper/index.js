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
  .page-container {
    height: calc(100vh - 49px);
  }

  .page-container > div.ui.basic.segment {
    border-left: 1px solid rgb(230, 236, 240);
    border-right: 1px solid rgb(230, 236, 240);
    margin: 0;
    padding-bottom: 28px;
    padding-left: 2em;
    padding-right: 2em;
  }

  .page-container > div.ui.basic.primary.segment {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const PageWrapper = ({ children }) => (
  <PageWrapperStyle>
    <Container className="page-container">
      {children}
    </Container>
  </PageWrapperStyle>
);

PageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

export default PageWrapper;
