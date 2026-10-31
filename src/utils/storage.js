import { INITIAL_PRODUCTS } from '../constants/sampleData';

const STORAGE_KEY = 'stockwise_inventory_v1';

/**
 * Loads products from browser localStorage.
 * If no data exists or an error occurs, seeds default sample products.
 * @returns {Array} List of product objects
 */
export function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveProducts(INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load products from localStorage. Falling back to sample data.', error);
    saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
}

/**
 * Persists products to localStorage.
 * @param {Array} products 
 */
export function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to localStorage.', error);
  }
}

/**
 * Resets inventory back to the sample data.
 * @returns {Array} Fresh copy of sample products
 */
export function resetToSampleData() {
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}
