import { describe, it, expect } from 'vitest';
import {
  calculateDashboardStats,
  getStockStatus,
  isLowStock,
  filterProducts,
  formatCurrency,
  formatNumber
} from '../utils/inventoryUtils';

describe('inventoryUtils', () => {
  const sampleList = [
    { id: '1', name: 'MacBook Pro', sku: 'LAP-001', category: 'Electronics', price: 1200, quantity: 5, lowStockThreshold: 10 },
    { id: '2', name: 'Cotton Socks', sku: 'APP-002', category: 'Apparel', price: 15, quantity: 20, lowStockThreshold: 5 },
    { id: '3', name: 'Wireless Mouse', sku: 'LAP-003', category: 'Electronics', price: 25, quantity: 0, lowStockThreshold: 4 }
  ];

  describe('calculateDashboardStats', () => {
    it('computes correct stats for an active inventory', () => {
      const stats = calculateDashboardStats(sampleList);
      expect(stats.totalProducts).toBe(3);
      // Total units: 5 + 20 + 0 = 25
      expect(stats.totalStockUnits).toBe(25);
      // Total value: (5 * 1200) + (20 * 15) + (0 * 25) = 6000 + 300 + 0 = 6300
      expect(stats.totalInventoryValue).toBe(6300);
      // Low stock: MacBook (5 <= 10) + Mouse (0 <= 4) = 2
      expect(stats.lowStockCount).toBe(2);
      expect(stats.outOfStockCount).toBe(1);
    });

    it('handles empty inventory gracefully', () => {
      const stats = calculateDashboardStats([]);
      expect(stats).toEqual({
        totalProducts: 0,
        totalStockUnits: 0,
        totalInventoryValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      });
    });
  });

  describe('getStockStatus', () => {
    it('returns "Out of Stock" (danger) when quantity is 0', () => {
      const result = getStockStatus(0, 5);
      expect(result.label).toBe('Out of Stock');
      expect(result.variant).toBe('danger');
    });

    it('returns "Low Stock" (warning) when quantity <= threshold', () => {
      const result = getStockStatus(3, 5);
      expect(result.label).toBe('Low Stock');
      expect(result.variant).toBe('warning');
    });

    it('returns "In Stock" (success) when quantity > threshold', () => {
      const result = getStockStatus(15, 5);
      expect(result.label).toBe('In Stock');
      expect(result.variant).toBe('success');
    });
  });

  describe('isLowStock', () => {
    it('flags true when quantity <= threshold', () => {
      expect(isLowStock({ quantity: 4, lowStockThreshold: 5 })).toBe(true);
      expect(isLowStock({ quantity: 5, lowStockThreshold: 5 })).toBe(true);
      expect(isLowStock({ quantity: 0, lowStockThreshold: 5 })).toBe(true);
    });

    it('flags false when quantity > threshold', () => {
      expect(isLowStock({ quantity: 6, lowStockThreshold: 5 })).toBe(false);
    });
  });

  describe('filterProducts', () => {
    it('filters by search term in product name', () => {
      const res = filterProducts(sampleList, { search: 'mouse' });
      expect(res).toHaveLength(1);
      expect(res[0].name).toBe('Wireless Mouse');
    });

    it('filters by search term in SKU', () => {
      const res = filterProducts(sampleList, { search: 'APP-002' });
      expect(res).toHaveLength(1);
      expect(res[0].name).toBe('Cotton Socks');
    });

    it('filters by category', () => {
      const res = filterProducts(sampleList, { category: 'Electronics' });
      expect(res).toHaveLength(2);
    });

    it('filters by stock status', () => {
      const lowStockOnly = filterProducts(sampleList, { stockStatus: 'Low Stock' });
      expect(lowStockOnly).toHaveLength(1);
      expect(lowStockOnly[0].name).toBe('MacBook Pro');

      const outOfStockOnly = filterProducts(sampleList, { stockStatus: 'Out of Stock' });
      expect(outOfStockOnly).toHaveLength(1);
      expect(outOfStockOnly[0].name).toBe('Wireless Mouse');

      const inStockOnly = filterProducts(sampleList, { stockStatus: 'In Stock' });
      expect(inStockOnly).toHaveLength(1);
      expect(inStockOnly[0].name).toBe('Cotton Socks');
    });
  });

  describe('formatting helpers', () => {
    it('formats currency with $ sign and 2 decimal points', () => {
      expect(formatCurrency(129.5)).toBe('$129.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats numbers with commas', () => {
      expect(formatNumber(12500)).toBe('12,500');
    });
  });
});
