/**
 * Generates initials from a given name string.
 *
 * @param {string} name - The input name string.
 * @returns {string} - The generated initials.
 */
export function nameToInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) {
    // If there's only one part, return the first letter twice
    return parts[0][0].toUpperCase() + parts[0][0].toUpperCase();
  }
  const firstInitial = parts[0][0].toUpperCase();
  const lastInitial = parts[parts.length - 1][0].toUpperCase();
  return firstInitial + lastInitial;
}
