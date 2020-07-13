import styled from 'styled-components';

const EditProfileStyle = styled.div`
  .image-stack {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    position: relative;
    margin-bottom: 1em;
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
  }

  img.banner-image.ui.centered.image {
    max-height: 185px;
    width: 100%;
    object-fit: cover;
    filter: brightness(0.4);

  }

  img.profile-image.ui.centered.image {
    margin-left: 0;
    filter: brightness(0.9);
  }

  .button-image-container {
    position: relative;
    width: 100%;

    button.button.image-button {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      i.camera.icon {
        margin: 0;
        height: auto;
      }
    }
  }

  .button-image-container .banner-image {
    width: 100%;
    height: auto;
  }

  .button-image-container .image-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    background-color: #555;
    color: white;
    font-size: 16px;
    padding: 12px 24px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
`;

export default EditProfileStyle;
