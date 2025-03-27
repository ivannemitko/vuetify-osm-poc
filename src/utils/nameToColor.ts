/**
 * Generates a color based on a given name string.
 * @param {string} name - The input name string.
 * @returns {string} - The generated color.
 */
export function nameToColor(name: string): string {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning'];
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
}
