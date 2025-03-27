// TODO: Consider removing leaflet dependency from core utils to make them more reusable
import * as L from 'leaflet';

import { getPlaceLatLng } from '../transforms/places.transforms';
import { getUserLatLng } from '../transforms/users.transforms';
import { type Place } from '../types/places';
import { type User } from '../types/users';

export function getBoundsForPlacesAndUsers(places: Place[], users: User[]): L.LatLngBounds {
  return L.latLngBounds([
    ...places.map(place => getPlaceLatLng(place)),
    ...users.map(user => getUserLatLng(user)),
  ]);
}
