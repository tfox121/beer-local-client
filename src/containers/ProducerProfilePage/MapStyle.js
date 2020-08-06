import styled from 'styled-components';

const MapStyle = styled.div`
  height: 100%;
  width: 100%;

  .leaflet-container {
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
    @media only screen and (max-width: 768px) {
      height: 100px;
    }
  }
`;

export default MapStyle;
