import styled from 'styled-components';

const ProducerDashboardStyle = styled.div`
  .my-masonry-grid {
    display: -webkit-box; /* Not needed if autoprefixing */
    display: -ms-flexbox; /* Not needed if autoprefixing */
    display: flex;
    margin-left: -30px; /* gutter size offset */
    width: auto;
  }
  .my-masonry-grid_column {
    padding-left: 30px; /* gutter size */
    background-clip: padding-box;
  }

  /* Style your items */
  .my-masonry-grid_column > div {
    /* change div to reference your elements you put in <Masonry> */
  }

  @media (max-width: 800px) {
    .my-masonry-grid {
      margin-left: -15px; /* gutter size offset */
    }
    .my-masonry-grid_column {
      padding-left: 15px; /* gutter size offset */
    }
    .my-masonry-grid_column > div {
      margin-bottom: 15px; /* space between items */
    }
  }

  .sales-summary {
    .ui.dividing.header {
      margin-top: 0.75em;
      margin-bottom: 10px;
    }
  }

  .sales-averages {
    .ui.header {
      margin-top: 0;
      margin-bottom: 5px;
    }
    .ui.header.top-level {
      margin-top: 1.5em;
    }
    .ui.header.top-level:first-child {
      margin-top: 0;
    }
  }
  @media (max-width: 600px) {
    .ui.stackable.grid > .header-column.wide.column h1.ui.header {
      text-align: center;
      font-size: 1.5em;
      padding: 0 2em;
    }
    .ui.stackable.grid > .button-column.wide.column {
      text-align: center;
    }

    div.ui.basic.segment > div.ui.stackable.three.column.grid {
      text-align: center;
    }
  }
`;

export default ProducerDashboardStyle;
