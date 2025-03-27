import type { Place } from '../types/places';

export function filterPlacesByTypes(places: Place[], selectedTypes: string[]): Place[] {
  if (selectedTypes.length === 0) {
    return places;
  }
  return places.filter(place => selectedTypes.includes(place.type));
}
