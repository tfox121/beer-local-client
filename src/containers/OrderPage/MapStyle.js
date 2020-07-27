import styled from 'styled-components';

const MapStyle = styled.div`
  height: 100%;
  width: 100%;

  .leaflet-container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: block;
    z-index: 1;
  }
`;

export default MapStyle;
