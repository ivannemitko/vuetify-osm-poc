/**
 * Formats a place type string for display
 *
 * @param placeType - The raw place type (e.g., "coffee_shop", "PARK")
 * @returns Formatted display string (e.g., "Coffee Shop", "Park")
 */
export function formatPlaceType(placeType: string): string {
  if (!placeType) {
    return '';
  }

  return placeType
    .toLowerCase() // Ensure consistent casing
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
    .trim(); // Remove any leading/trailing whitespace
}
