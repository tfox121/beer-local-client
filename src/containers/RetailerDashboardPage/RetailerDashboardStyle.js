import styled from 'styled-components';

const RetailerDashboardStyle = styled.div`
  div.content {
    div.summary {
      height: 20px;
    }
    div.ui.segment {
      max-width: 500px;
      min-width: 500px;
      margin: .5em 0 0;
    }
  }
  div.images.extra {
    display: flex;
    img.circular {
      min-width: 8em;
    }

    p {
      font-size: 11px;
      padding: 1em;
    }
  }
  div.extra {
    margin: 0;
  }
  .blog-text {
    figure {
      display: flex;
      justify-content: center;
    }

    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }
`;

export default RetailerDashboardStyle;
