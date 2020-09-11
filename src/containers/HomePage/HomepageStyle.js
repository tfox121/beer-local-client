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
    color: #fdfdf0;
    font-size: 5em;
    font-family: "Yantramanav", sans-serif;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
    line-height: 100%;
  }

  div.ui.header.secondary {
    color: #fdfdf0;
    font-size: 4em;
    font-family: "Yantramanav", sans-serif;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
    line-height: 100%;
  }

  h5.ui.header.sub-header {
    color: #fdfdf0;
    font-size: 1.5em;
    font-family: "Yantramanav", sans-serif;
    font-weight: 400;
    margin: 0 0 1em 0;
    letter-spacing: 0.5px;
  }

  .full-page {
    z-index: 1;
  }

  .full-page::after {
    background-color: rgba(0, 0, 0, 0.75);
    content: " ";
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
    content: " ";
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

  .action-group {
    height: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .form {
      max-width: 75%;

      input::placeholder {
        color: rgba(191, 191, 191, 0.87);
        opacity: 1;
      }

      .default.text {
        font-family: "Lato";
      }

      @media only screen and (max-width: 424px) {
        padding-top: 7em;

        .equal.width.fields {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          div {
            width: 100%;

            .field {
              padding-left: 0.5em;
              padding-right: 0.5em;
            }
          }

          .ui.basic.inverted.button {
            width: 100%;
          }
        }
      }
    }
  }
`;

export default HomepageStyle;
