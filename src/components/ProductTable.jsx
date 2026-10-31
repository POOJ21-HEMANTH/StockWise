import React from 'react';
import { Edit2, Trash2, AlertTriangle, PackageOpen, Plus } from 'lucide-react';
import { getStockStatus, formatCurrency, formatNumber, isLowStock } from '../utils/inventoryUtils';

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onAddNew,
  hasFilters,
  onResetFilters
}) {
  if (products.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">
          <PackageOpen size={48} strokeWidth={1.5} />
        </div>
        <h3 className="empty-state-title">
          {hasFilters ? 'No matching products found' : 'No inventory items yet'}
        </h3>
        <p className="empty-state-text">
          {hasFilters
            ? 'Try adjusting your search keywords, category filters, or stock status.'
            : 'Get started by creating your first product to track stock levels.'}
        </p>
        <div className="empty-state-actions">
          {hasFilters ? (
            <button type="button" className="btn btn-secondary" onClick={onResetFilters}>
              Clear All Filters
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onAddNew}>
              <Plus size={16} /> Add First Product
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Product Name & SKU</th>
            <th>Category</th>
            <th className="text-right">Unit Price</th>
            <th className="text-right">Quantity</th>
            <th>Stock Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const status = getStockStatus(product.quantity, product.lowStockThreshold);
            const lowStock = isLowStock(product);
            const isZero = Number(product.quantity) === 0;

            return (
              <tr
                key={product.id}
                className={`table-row ${lowStock ? 'row-low-stock' : ''}`}
              >
                {/* Product Name & SKU */}
                <td className="product-identity-cell">
                  <div className="product-title-group">
                    <span className="product-name">{product.name}</span>
                    <span className="product-sku" title={`SKU: ${product.sku}`}>
                      {product.sku}
                    </span>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <span className="category-pill">{product.category}</span>
                </td>

                {/* Unit Price */}
                <td className="text-right font-medium">
                  {formatCurrency(product.price)}
                </td>

                {/* Quantity + Threshold info */}
                <td className="text-right">
                  <div className="quantity-wrapper">
                    <span className={`quantity-value ${isZero ? 'qty-zero' : lowStock ? 'qty-low' : ''}`}>
                      {formatNumber(product.quantity)}
                    </span>
                    <span className="threshold-hint" title={`Low stock alert threshold: ${product.lowStockThreshold ?? 5}`}>
                      min: {product.lowStockThreshold ?? 5}
                    </span>
                  </div>
                </td>

                {/* Stock Status Badge */}
                <td>
                  <div className={`status-badge badge-${status.variant}`}>
                    {status.variant !== 'success' && <AlertTriangle size={12} />}
                    <span>{status.label}</span>
                  </div>
                </td>

                {/* Actions (Edit & Delete) */}
                <td className="text-right actions-cell">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="action-btn action-edit"
                      onClick={() => onEdit(product)}
                      title={`Edit ${product.name}`}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="action-btn action-delete"
                      onClick={() => onDelete(product)}
                      title={`Delete ${product.name}`}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
