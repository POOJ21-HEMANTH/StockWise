/**
 * Computes live summary statistics for the inventory dashboard.
 * @param {Array} products - List of products
 * @returns {Object} Dashboard metrics
 */
export function calculateDashboardStats(products = []) {
  if (!Array.isArray(products) || products.length === 0) {
    return {
      totalProducts: 0,
      totalStockUnits: 0,
      totalInventoryValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    };
  }

  let totalStockUnits = 0;
  let totalInventoryValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const item of products) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const threshold = Number(item.lowStockThreshold ?? 5);

    totalStockUnits += qty;
    totalInventoryValue += qty * price;

    if (qty === 0) {
      outOfStockCount += 1;
      lowStockCount += 1; // Out of stock is also critical low stock
    } else if (qty <= threshold) {
      lowStockCount += 1;
    }
  }

  return {
    totalProducts: products.length,
    totalStockUnits,
    totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
    lowStockCount,
    outOfStockCount,
  };
}

/**
 * Returns human-readable status badge info based on quantity and threshold.
 * @param {number} quantity 
 * @param {number} threshold 
 * @returns {{ label: string, variant: 'success' | 'warning' | 'danger' }}
 */
export function getStockStatus(quantity, threshold = 5) {
  const qty = Number(quantity);
  const thr = Number(threshold);

  if (qty === 0) {
    return { label: 'Out of Stock', variant: 'danger' };
  }
  if (qty <= thr) {
    return { label: 'Low Stock', variant: 'warning' };
  }
  return { label: 'In Stock', variant: 'success' };
}

/**
 * Checks if a product's stock is at or below its threshold.
 * @param {Object} product 
 * @returns {boolean}
 */
export function isLowStock(product) {
  if (!product) return false;
  const qty = Number(product.quantity);
  const thr = Number(product.lowStockThreshold ?? 5);
  return qty <= thr;
}

/**
 * Filters and searches products by query, category, and status.
 * @param {Array} products 
 * @param {Object} filters 
 * @returns {Array} Filtered list
 */
export function filterProducts(products = [], { search = '', category = 'All Categories', stockStatus = 'All' } = {}) {
  const query = search.trim().toLowerCase();

  return products.filter((product) => {
    // 1. Text Search (Matches Name or SKU)
    const matchesName = product.name?.toLowerCase().includes(query);
    const matchesSku = product.sku?.toLowerCase().includes(query);
    const matchesSearch = !query || matchesName || matchesSku;

    // 2. Category Filter
    const matchesCategory =
      !category ||
      category === 'All Categories' ||
      product.category === category;

    // 3. Stock Status Filter
    const statusInfo = getStockStatus(product.quantity, product.lowStockThreshold);
    let matchesStatus = true;
    if (stockStatus && stockStatus !== 'All') {
      matchesStatus = statusInfo.label === stockStatus;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });
}

/**
 * Formats a currency amount into standard USD display ($X,XXX.XX).
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formats a number with comma separators.
 * @param {number} num 
 * @returns {string}
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num || 0);
}
