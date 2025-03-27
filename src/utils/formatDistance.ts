/**
 * Formats a distance value for display, converting it to either meters or kilometers.
 *
 * @param {number} meters - The distance in meters to be formatted.
 * @returns {string} - The formatted distance string, either in meters or kilometers.
 *                     If the distance is 1000 meters or more, it is converted to kilometers
 *                     with one decimal place. Otherwise, it is rounded to the nearest meter.
 */
export function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}
