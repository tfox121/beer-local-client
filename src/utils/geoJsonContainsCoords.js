import { geoContains } from 'd3';
import rewind from '@mapbox/geojson-rewind';

const geoJsonContainsCoords = (polygonsObj, latlng) => {
  if (!polygonsObj) {
    return false;
  }
  const { lat, lng } = latlng;
  const rwGeoJson = rewind(polygonsObj, true);
  return geoContains(rwGeoJson, [lng, lat]);
};

export default geoJsonContainsCoords;
