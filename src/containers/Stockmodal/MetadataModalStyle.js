import styled from 'styled-components';

const MetadataModalStyle = styled.div`
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

      i.camera.icon {
        height: auto;
      }
    }
  }
`;

export default MetadataModalStyle;
