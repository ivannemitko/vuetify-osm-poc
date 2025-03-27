export enum KnownPlaceType {
  Store = 'store',
  Cafe = 'cafe',
  Office = 'office',
}

export type UnknownPlaceType = string;
export type PlaceType = KnownPlaceType | UnknownPlaceType;
export type Coordinates = [number, number];

export interface StaticPlace {
  id: number;
  name: string;
  type: PlaceType;
  coordinates: Coordinates;
}

export interface CustomPlace {
  id: string;
  name: string;
  type: PlaceType;
  coordinates: Coordinates;
  createdAt: string;
  updatedAt: string;
  isCustomPlace: true;
}

export type Place = StaticPlace | CustomPlace;

export function isCustomPlace(place: Place): place is CustomPlace {
  return 'isCustomPlace' in place && place.isCustomPlace;
}

export function isStaticPlace(place: Place): place is StaticPlace {
  return typeof place.id === 'number';
}
