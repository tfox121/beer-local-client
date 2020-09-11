import styled from 'styled-components';

const RetailerDashboardStyle = styled.div`
  .images.extra {
    img {
      margin: 0;
    }
    .follow-container {
      img {
        // min-width: 60px;
        // width: 60px;
        // min-height: 60px;
        // height: 60px;
        margin: 0;
      }
    }
  }

  div.blog-text figure {
    margin: 0;
  }

  div.content {
    div.summary {
      height: 20px;
    }
    div.ui.segment {
      // max-width: 500px;
      min-width: 500px;
      margin: 0.5em 0 0;
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

  .ui.feed > .event > .content div.extra.text {
    max-width: unset;
  }

  div > button.ui.positive.button.follow-button {
    min-width: 105px;
    max-height: 30px;
    align-self: flex-end;
    display: flex;
    position: absolute;
    right: 1em;
  }

  @media only screen and (max-width: 424px) {
    div.content > div.ui.segment,
    div.text.extra > div.ui.segment {
      min-width: unset;

      .images.extra {
        img {
          min-width: 60px;
          width: 60px;
          min-height: 60px;
          height: 60px;
          margin: 0;
        }
      }
    }

    .summary {
      font-size: 0.8em;
    }

    div.content div.summary {
      height: unset;
    }

    div.images.extra p {
      padding-bottom: 3.5em;
    }
  }
`;

export default RetailerDashboardStyle;
