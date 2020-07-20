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
    min-height: 100%;
    min-width: 100%;
    overflow: auto;
  }

  p,
  label {
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

  /* Blog editor */

  .blog-editor {
    min-height: 300px;
    cursor: text;
    border: 1px solid #F1F1F1;
    padding: 0 1em;

  }

  .blogpost-display-checkbox {
    margin-top: 1em
  }

  .blogpost-modal-actions {
    display: flex;
  }

  .blogpost-modal-actions > div {
    margin-right: auto;
    display: flex;
    align-items: center;
  }

  .blogpost-display-checkbox > div.checkbox > input:checked~label:after {
    top: -2px;
  }

  div.image-resizer.ui.modal {
    width: unset;
  }

  /* Modal Style */
  div.ui.modal {
    @media only screen and (max-width: 425px) {
      left: 0px;
      min-width: 800px;
    }
  }
`;

export default GlobalStyle;
