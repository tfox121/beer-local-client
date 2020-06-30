import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: calc(100% - 27.5px);
    width: 100%;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  .ui.top.fixed.menu {
    height: 50px;
  }

  /* stock modal */
  .ui.large.modal {
    width: 90%;
  }

    button.stock-save {
    min-width: 71.36px;
  }

  button.stock-save > i.check.icon {
    margin: 0 !important;
  }
`;

export default GlobalStyle;
