import styled from 'styled-components';

const PromotionModalStyle = styled.div`
  div.ui.input>input {
    height: 38px;
    font-size: 1rem !important;
    margin: 0 !important;
    text-align: center;
    padding: 0.3em;
    border-radius: 4.5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgba(34, 36, 38, 0.15);
    outline: 0px;
    width: 2em;
  }

  div.ui.input>input::placeholder {
    color: rgba(191,191,191,.87);
    opacity: 1;
  }

  div.ui.input>input:hover {
    border-color: rgba(34, 36, 38, 0.35);
  }

  .condition-dropdown, .discount-dropdown {
    text-align: center;
    margin-bottom: 1em;
  }

  .spend-input, .discount-value-input, .discount-percentage-input {
    height: 38px;
    font-size: 1rem !important;
    margin: 0 !important;
    text-align: center;
    padding: 0.3em;
    border-radius: 4.5px;
    border-style: solid;
    border-width: 1px;
    border-color: rgba(34, 36, 38, 0.15);
    outline: 0px;
    width: 7em;
  }

  .spend-input:focus {
    border: 1px solid #96c8da;
  }

  .spend-input:hover {
    border-color: rgba(34, 36, 38, 0.35);
  }

  .multibuy-quantity, .free-item-quantity {
    width: 5.5em;
    /* margin-right: 1em; */
  }

  .ui.inline.dropdown {
    margin-right: 1em;
    .dropdown {
      margin: -.78571429em;
    }
    .default.text {
      font-weight: unset;
    }
  }
`;

export default PromotionModalStyle;
