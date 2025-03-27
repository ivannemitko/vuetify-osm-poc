import type * as GeoJSON from 'geojson';

export type PlaceFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, {
  id: number | string;
  name: string;
  type: string;
}>;

export type UserFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, {
  id: number;
  name: string;
}>;
