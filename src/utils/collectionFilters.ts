/**
 * Filters an array of items by their type property
 *
 * @param {Array} items - Collection of items to filter
 * @param {Array} selectedTypes - Types to include in results
 * @param {string} [typeKey='type'] - Property name containing the type
 * @returns {Array} Filtered array
 */
export function filterByType<T extends Record<string, unknown>>(
  items: T[],
  selectedTypes: string[],
  typeKey: keyof T = 'type',
): T[] {
  if (!selectedTypes || selectedTypes.length === 0) {
    return [...items];
  }
  return items.filter(item => selectedTypes.includes(item[typeKey] as unknown as string));
}

/**
 * Creates a filtering function with predefined options
 *
 * @param {Object} options
 * @param {string} [options.typeKey='type'] - Property name containing the type
 * @returns {Function} Configured filter function
 */
export function createTypeFilter<T extends Record<string, unknown>>(options: { typeKey?: keyof T } = {}) {
  const { typeKey = 'type' } = options;

  return function(items: T[], selectedTypes: string[]): T[] {
    return filterByType(items, selectedTypes, typeKey);
  };
}
