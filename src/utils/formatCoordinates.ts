/**
 * Formats a pair of coordinates for display, rounding each value to six decimal places.
 *
 * @param {[number, number]} coords - An array containing two numbers representing the coordinates.
 *                                    The first number is typically the latitude, and the second is the longitude.
 * @returns {string} - A formatted string representing the coordinates, with each value rounded to six decimal places.
 */
export function formatCoordinates(coords: [number, number]): string {
  return `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
}
