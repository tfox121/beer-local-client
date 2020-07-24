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
  .my-masonry-grid_column > div { /* change div to reference your elements you put in <Masonry> */
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
      margin-bottom: 10px;
    }
  }

  .sales-averages {
    .ui.header {
      margin-bottom: 5px;
    }
  }
`;

export default ProducerDashboardStyle;
