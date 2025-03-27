import type { PlaceFeatureCollection } from '../types/geojson';
import type { Place } from '../types/places';

export function getPlaceLatLng(place: Place): [number, number] {
  return [place.coordinates[0], place.coordinates[1]];
}

export function convertPlacesToGeoJSON(places: Place[]): PlaceFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.map((place) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [place.coordinates[1], place.coordinates[0]],
      },
      properties: {
        id: place.id,
        name: place.name,
        type: place.type,
      },
    })),
  };
}
