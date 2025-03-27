// TODO: Consider removing leaflet dependency from core utils to make them more reusable
import * as L from 'leaflet';

import type { Place, User, UserWithDistance } from '@/core';

export function findClosestUsers(place: Place, users: User[], count = 3): UserWithDistance[] {
  const placeLatLng = L.latLng(place.coordinates[0], place.coordinates[1]);
  const closestUsers: UserWithDistance[] = [];

  users.forEach((user) => {
    const userLatLng = L.latLng(parseFloat(user.address.geo.lat), parseFloat(user.address.geo.lng));
    const userDistance = placeLatLng.distanceTo(userLatLng) / 1000;

    const userWithDistance: UserWithDistance = { ...user, distance: userDistance };

    if (closestUsers.length < count) {
      closestUsers.push(userWithDistance);
      closestUsers.sort((a, b) => a.distance - b.distance);
    } else if (userDistance < closestUsers[closestUsers.length - 1].distance) {
      closestUsers[closestUsers.length - 1] = userWithDistance;
      closestUsers.sort((a, b) => a.distance - b.distance);
    }
  });

  return closestUsers;
}
