import styled from 'styled-components';

const AvailabilityMobileStyle = styled.div`
  /* min-width: 700px; */

  .ui.table td, .ui.table th {
    text-align: center;
  }

  .ui.table th.data-header-0, .ui.table td.data-cell-0 {
    text-align: left;
  }

  th.data-header-2 {
    min-width: 75px;
  }

  .product-info {
    padding: 1em;
    font-size: 11px;
  }

  .ui.table td.row-accordion {
    max-height: 200px;
    overflow: hidden;
    border: none;
    transition: all 0.5s ease;
    will-change: transform;

    * {
      overflow: hidden;
      max-height: 200px;
      transition: all 0.5s ease;
      will-change: transform;
    }
  }

  .ui.table td.row-accordion-hidden {
    overflow: hidden;
    line-height: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    border: none;
    margin-top: 0;
    margin-bottom: 0;
    transition: all 0.5s ease;
    will-change: transform;

    * {
    overflow: hidden;
    line-height: 0;
    max-height: 0;
    transition: all 0.5s ease;
    will-change: transform;
    }
  }
`;

export default AvailabilityMobileStyle;
