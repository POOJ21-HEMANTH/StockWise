/**
 * Validates product form fields.
 * 
 * Rules:
 * - Product Name: required, non-empty, trimmed length >= 2
 * - SKU: required, alphanumeric/dashes, unique across products (ignoring current product id on edit)
 * - Category: required
 * - Unit Price: required, numeric, >= 0
 * - Quantity: required, integer, >= 0
 * - Low Stock Threshold: required, integer, >= 0
 * 
 * @param {Object} formData 
 * @param {Array} existingProducts 
 * @param {string|null} currentProductId 
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateProduct(formData, existingProducts = [], currentProductId = null) {
  const errors = {};

  // 1. Product Name
  const trimmedName = (formData.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Product name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Product name must be at least 2 characters long.';
  }

  // 2. SKU (Stock Keeping Unit)
  const trimmedSku = (formData.sku || '').trim().toUpperCase();
  if (!trimmedSku) {
    errors.sku = 'SKU is required.';
  } else if (!/^[A-Za-z0-9-_]+$/.test(trimmedSku)) {
    errors.sku = 'SKU can only contain letters, numbers, hyphens, and underscores.';
  } else {
    // Check uniqueness (exclude current product if editing)
    const isDuplicate = existingProducts.some((p) => {
      const matchSku = (p.sku || '').trim().toUpperCase() === trimmedSku;
      const isSameItem = currentProductId && String(p.id) === String(currentProductId);
      return matchSku && !isSameItem;
    });

    if (isDuplicate) {
      errors.sku = `SKU "${trimmedSku}" is already assigned to another product.`;
    }
  }

  // 3. Category
  const trimmedCategory = (formData.category || '').trim();
  if (!trimmedCategory || trimmedCategory === 'All Categories') {
    errors.category = 'Please select a valid category.';
  }

  // 4. Unit Price
  const priceStr = String(formData.price ?? '').trim();
  if (priceStr === '') {
    errors.price = 'Unit price is required.';
  } else {
    const numPrice = Number(priceStr);
    if (isNaN(numPrice)) {
      errors.price = 'Unit price must be a valid number.';
    } else if (numPrice < 0) {
      errors.price = 'Unit price cannot be negative.';
    }
  }

  // 5. Quantity (Nonnegative integer)
  const qtyStr = String(formData.quantity ?? '').trim();
  if (qtyStr === '') {
    errors.quantity = 'Quantity is required.';
  } else {
    const numQty = Number(qtyStr);
    if (isNaN(numQty) || !Number.isInteger(numQty)) {
      errors.quantity = 'Quantity must be a whole number (integer).';
    } else if (numQty < 0) {
      errors.quantity = 'Quantity cannot be negative.';
    }
  }

  // 6. Low Stock Threshold (Nonnegative integer)
  const thresholdStr = String(formData.lowStockThreshold ?? '').trim();
  if (thresholdStr === '') {
    errors.lowStockThreshold = 'Low stock threshold is required.';
  } else {
    const numThreshold = Number(thresholdStr);
    if (isNaN(numThreshold) || !Number.isInteger(numThreshold)) {
      errors.lowStockThreshold = 'Threshold must be a whole number (integer).';
    } else if (numThreshold < 0) {
      errors.lowStockThreshold = 'Threshold cannot be negative.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
