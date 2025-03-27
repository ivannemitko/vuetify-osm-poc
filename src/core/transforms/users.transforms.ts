import type { UserFeatureCollection } from '../types/geojson';
import type { User } from '../types/users';

export function getUserLatLng(user: User): [number, number] {
  return [parseFloat(user.address.geo.lat), parseFloat(user.address.geo.lng)];
}

export function convertUsersToGeoJSON(users: User[]): UserFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: users.map((user) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          parseFloat(user.address.geo.lng),
          parseFloat(user.address.geo.lat),
        ],
      },
      properties: {
        id: user.id,
        name: user.name,
      },
    })),
  };
}
