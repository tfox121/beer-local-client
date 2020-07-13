import styled from 'styled-components';

const BannerStyle = styled.div`
  border-left: 1px solid rgb(230, 236, 240);
  border-right: 1px solid rgb(230, 236, 240);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  position: relative;
  width: 100%;

  .image-stack {
    border-left: 1px solid rgb(230, 236, 240);
    border-right: 1px solid rgb(230, 236, 240);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    position: relative;
  }
  .image-stack__item--bottom {
    grid-column: 1 / span 16;
    grid-row: 1; // must be on the same row as the other image
    height: 185px;
    background-color: lightgray;
  }

  .image-stack__item--top {
    padding: 0 28px;
    padding-top: 110px;
    grid-column: 1 / -1;
    grid-row: 1; // make this image be on the same row
    z-index: 1; // make this image render on top of the bottom
  }

  .bordered.circular.image {
    border: 3px solid white;
    background-color: black;
  }

  .banner-image.ui.centered.image {
    max-height: 185px;
    width: 100%;
    object-fit: cover;
  }

  .profile-image.ui.centered.image {
    margin-left: 0;
  }

  .ui.grid > .row > .profile-buttons.column {
    padding-top: 100px;
  }
`;

export default BannerStyle;
