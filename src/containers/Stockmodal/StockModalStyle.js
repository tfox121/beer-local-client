import styled from 'styled-components';

const StockModalStyle = styled.div`
  .pagination {
    padding-bottom: 0.5em;
    padding-top: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;

    span > input {
      margin: 0 !important;
      text-align: center;
      width
      height: 100%;
      padding-top: 5.5px;
      padding-bottom: 5.5px;
      border-radius: 4.5px;
      border: 1px solid rgb(118, 118, 118);
      opacity: 0.4;

    }

    span > input:focus {
      outline: none !important;
      border: 1px solid rgb(38, 132, 255);
      border-radius: 4.5px;
      opacity: 1;
    }

    .pagination-input {
      width: 50px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    input[type=number] {
        -moz-appearance:textfield; /* Firefox */
    }
  }
`;

export default StockModalStyle;
