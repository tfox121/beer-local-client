import styled from 'styled-components';

const HomepageStyle = styled.div`
  height: 100%;
  min-height: calc(100vh - 49px);
  display: flex;
  flex-direction: column;
  justify-content: center;

  .ui.segment {
    z-index: 2;
  }

  div.ui.header.primary {
    color: #FDFDF0;
    font-size: 5em;
    font-family: 'Yantramanav', sans-serif;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
    line-height: 100%;
  }

  h5.ui.header.sub-header {
    color: #FDFDF0;
    font-size: 1.5em;
    font-family: 'Yantramanav', sans-serif;
    font-weight: 400;
    margin: 0 0 1em 0;
    letter-spacing: 0.5px;
  }

  .full-page {
    z-index: 1;
  }

  .full-page::after {
    background-color: rgba(0, 0, 0, 0.75);
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 1;
    background-size: cover;
    background-position: center;
  }

  .full-page::before {
    background-image: url("./images/homepage-background-1.jpg");
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 1;
    background-size: cover;
    background-position: center;
    filter: blur(2px);
  }
`;

export default HomepageStyle;
