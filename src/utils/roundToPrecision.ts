/**
 * Rounds a number to a specified precision (decimal places)
 * Handles floating-point rounding issues using Number.EPSILON correction
 *
 * @param num - The number to round
 * @param precision - Number of decimal places (default: 2)
 * @returns The rounded number
 */
export function roundToPrecision(num: number, precision: number = 2): number {
  // Handle NaN input
  if (isNaN(num)) {
    return NaN;
  }
  const factor = 10 ** precision;
  // Correct floating-point rounding issues with Number.EPSILON
  return Math.round((num + Number.EPSILON) * factor) / factor;
}
