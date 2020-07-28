import styled from 'styled-components';

const BusinessTypeSelectionStyle = styled.div`

div.two.column.grid {
  margin: auto;
  height: 90%;
  width: 90%;
}

div.two.column.grid > div.row {
  height: 90%;
  width: 90%;
}
/*
.two.column.grid >  .row > button.column.typeSelector.brewery {
  margin-right: 2px;
} */

.two.column.grid >  .row > button.column.typeSelector {
  position: relative;
  overflow: hidden;
  background: none;
  z-index: 1;
  border: none;
  cursor: pointer;
  color: white;
  min-height: 75vh;
}

.two.column.grid >  .row > button.column.typeSelector::after {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;
  background-size: cover;
  background-position: center;
}

.two.column.grid >  .row > button.column.typeSelector.producer::after {
  background-image: url("./images/profileCreation/breweryBackground.jpg");
}

.two.column.grid >  .row > button.column.typeSelector.retailer::after {
  background-image: url("./images/profileCreation/retailerBackground.jpg");
}
`;

export default BusinessTypeSelectionStyle;
