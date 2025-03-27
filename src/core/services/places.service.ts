import type { StaticPlace } from '../types/places';

export async function fetchPlaces(): Promise<StaticPlace[]> {
  const response = await fetch('/data/places.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch places: ${response.statusText}`);
  }
  return response.json();
}
