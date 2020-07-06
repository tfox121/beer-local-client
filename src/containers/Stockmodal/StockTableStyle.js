import styled from 'styled-components';

const StockTableStyle = styled.div`
  overflow: auto;
  min-height: 200px;
  // padding-left: 1%;
  // padding-right: 1%;

  .pagination {
    padding-bottom: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-input, .filter-input {
    font-size: 1rem !important;
    margin: 0 !important;
    width: 100%;
    min-width: 100px;
    text-align: center;
    height: 100%;
    padding-top: 5.5px;
    padding-bottom: 5.5px;
    border-radius: 4.5px;
    border-style: solid;
    border-width: 1px;
  }

  .table-input {
    border: 0;
  }

  .table-input:focus, .filter-input:focus {
    outline: none !important;
    border: 1px solid rgb(38, 132, 255);
    border-radius: 4.5px;
    opacity: 1;
  }

  .table-dropdown {
    font-family: sans-serif;
    border: none;
    min-width: 105px;
  }

  .table-header,
  .table-body {
    overflow: hidden;
  }

  .header-cell,
  .table-cell {
    margin: 0 !important;
    padding: 0.5rem !important;
  }

  .header-cell > div:first-child {
    margin-bottom: 0.75em;
  }

  tr > .header-cell:first-child > div:first-child {
    margin-bottom: 0;
  }

  .ui.compact.table.stock-table {
    overflow: auto;
  }

  td {
    text-align: center !important;
  }

  input[type='range'] {
    width: 70px;
  }

  th {
    text-align: center !important;
  }

  th:first-child {
    width: 15px;
    padding-left: 1em !important;
  }

  th:nth-child(2) {
    width: 300px;
    min-width: 210px;
  }

  th:nth-child(3) {
    max-width: 100px;
  }

  th:nth-child(5) {
    max-width: 100px;
  }

  td:first-child {
    text-align: center !important;
    padding-left: 1em !important;
  }

  th:last-child > .filter-container {
    max-width: 100px;
  }

  td:nth-child(2) input {
    text-align: left;
  }

  .column-header {
    width: fit-content;
    margin: auto;
  }

  .filter-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    width: fit-content
  }

  .filter-container > input[type=range] {
    margin-right: 0.5em;
  }

  th:nth-child(2) {
    text-align: left !important;
    .column-header {
      margin-left: 0
    }
    .filter-container {
      margin-left: 0
        .filter-input {
        text-align: left !important;
        padding-left: 10px;
      }
    }
  }

  th.header-cell > div > input,
  th.header-cell > div > select {
    opacity: 0.4;
  }
`;

export default StockTableStyle;
