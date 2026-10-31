import { describe, it, expect } from 'vitest';
import { validateProduct } from '../utils/validation';

describe('validateProduct', () => {
  const existingList = [
    { id: '1', sku: 'ELEC-100', name: 'Item 1' },
    { id: '2', sku: 'ELEC-200', name: 'Item 2' }
  ];

  it('validates a correct product successfully', () => {
    const validData = {
      name: 'Wireless Mouse',
      sku: 'ELEC-300',
      category: 'Electronics',
      price: '29.99',
      quantity: '10',
      lowStockThreshold: '3'
    };

    const result = validateProduct(validData, existingList);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('rejects empty name and name with less than 2 characters', () => {
    const resEmpty = validateProduct({ name: '', sku: 'SKU1', category: 'Tech', price: 10, quantity: 1, lowStockThreshold: 1 }, existingList);
    expect(resEmpty.isValid).toBe(false);
    expect(resEmpty.errors.name).toMatch(/required/i);

    const resShort = validateProduct({ name: 'A', sku: 'SKU1', category: 'Tech', price: 10, quantity: 1, lowStockThreshold: 1 }, existingList);
    expect(resShort.isValid).toBe(false);
    expect(resShort.errors.name).toMatch(/at least 2/i);
  });

  it('enforces SKU uniqueness when adding a new item', () => {
    const duplicateSkuData = {
      name: 'Duplicate Item',
      sku: 'elec-100', // case insensitive check
      category: 'Electronics',
      price: 15,
      quantity: 5,
      lowStockThreshold: 2
    };

    const result = validateProduct(duplicateSkuData, existingList);
    expect(result.isValid).toBe(false);
    expect(result.errors.sku).toMatch(/already assigned/i);
  });

  it('allows same SKU if editing the existing product itself', () => {
    const editData = {
      name: 'Item 1 Renamed',
      sku: 'ELEC-100',
      category: 'Electronics',
      price: 19.99,
      quantity: 8,
      lowStockThreshold: 2
    };

    // Editing item with ID '1'
    const result = validateProduct(editData, existingList, '1');
    expect(result.isValid).toBe(true);
    expect(result.errors.sku).toBeUndefined();
  });

  it('rejects negative or invalid prices', () => {
    const negativePrice = validateProduct({
      name: 'Item',
      sku: 'SKU-99',
      category: 'Tech',
      price: '-5.00',
      quantity: '10',
      lowStockThreshold: '2'
    }, existingList);
    expect(negativePrice.isValid).toBe(false);
    expect(negativePrice.errors.price).toMatch(/cannot be negative/i);

    const invalidPrice = validateProduct({
      name: 'Item',
      sku: 'SKU-99',
      category: 'Tech',
      price: 'abc',
      quantity: '10',
      lowStockThreshold: '2'
    }, existingList);
    expect(invalidPrice.isValid).toBe(false);
    expect(invalidPrice.errors.price).toMatch(/valid number/i);
  });

  it('rejects negative or fractional quantities', () => {
    const negativeQty = validateProduct({
      name: 'Item',
      sku: 'SKU-99',
      category: 'Tech',
      price: '10',
      quantity: '-2',
      lowStockThreshold: '2'
    }, existingList);
    expect(negativeQty.isValid).toBe(false);
    expect(negativeQty.errors.quantity).toMatch(/cannot be negative/i);

    const fractionalQty = validateProduct({
      name: 'Item',
      sku: 'SKU-99',
      category: 'Tech',
      price: '10',
      quantity: '3.5',
      lowStockThreshold: '2'
    }, existingList);
    expect(fractionalQty.isValid).toBe(false);
    expect(fractionalQty.errors.quantity).toMatch(/whole number/i);
  });

  it('rejects negative threshold', () => {
    const res = validateProduct({
      name: 'Item',
      sku: 'SKU-99',
      category: 'Tech',
      price: '10',
      quantity: '5',
      lowStockThreshold: '-1'
    }, existingList);
    expect(res.isValid).toBe(false);
    expect(res.errors.lowStockThreshold).toMatch(/cannot be negative/i);
  });
});
