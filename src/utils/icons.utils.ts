import 'leaflet.awesome-markers';

import * as L from 'leaflet';

import type { PlaceType } from '@/core';
import { KnownPlaceType } from '@/core';

const PLACE_TYPE_ICONS: Record<PlaceType, string> = {
  [KnownPlaceType.Store]: 'store',
  [KnownPlaceType.Cafe]: 'coffee',
  [KnownPlaceType.Office]: 'office-building',
  default: 'help',
};

export function getPlaceMarkerIcon(
  type: PlaceType,
  color: L.AwesomeMarkers.AwesomeMarkersIconOptions['markerColor'] = 'purple',
): L.AwesomeMarkers.Icon {
  return L.AwesomeMarkers.icon({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    prefix: 'mdi',
    icon: getPlaceTypeIcon(type, { omitPrefix: true }),
    markerColor: color,
  });
}

export function getPlaceTypeIcon(type: PlaceType, options: { omitPrefix?: boolean } = {}): string {
  const prefix = options.omitPrefix ? '' : 'mdi-';
  const icon = PLACE_TYPE_ICONS[type] || PLACE_TYPE_ICONS.default;
  return `${prefix}${icon}`;
}
