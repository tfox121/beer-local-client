/**
 *
 * PageWrapper
 *
 */

import styled from 'styled-components';
import React from 'react';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const PageWrapperStyle = styled(Container)`
  &&& {
    background-color: white;
    min-height: calc(100vh - 49px);
    min-width: 800px;

  @media only screen and (max-width: 767px) {
    margin-left: 0 !important;
  }

    div.ui.text.loader {
      min-height: 100%;
    }
    /* .page-container {
      height: calc(100vh - 49px);
    } */

    div.ui.basic.segment.wrapper {
      width: 100%;
      border-left: 1px solid rgb(230, 236, 240);
      border-right: 1px solid rgb(230, 236, 240);
      margin: 0;
      padding-top: 1.5em;
      /* padding-bottom: 28px; */
      padding-left: 2em;
      padding-right: 2em;
    }

    div.ui.basic.primary.segment {
      height: 100%;
      min-height: 690px;
      display: flex;
      flex-direction: column;
    }
  }
`;

const PageWrapper = ({ children }) => (
  <PageWrapperStyle>
    {children}
  </PageWrapperStyle>
);

PageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

export default PageWrapper;
