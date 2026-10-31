import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Save, AlertCircle } from 'lucide-react';
import { validateProduct } from '../utils/validation';

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  existingProducts,
  categories
}) {
  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    lowStockThreshold: '5',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        sku: productToEdit.sku || '',
        category: productToEdit.category || '',
        price: String(productToEdit.price ?? ''),
        quantity: String(productToEdit.quantity ?? ''),
        lowStockThreshold: String(productToEdit.lowStockThreshold ?? '5'),
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: categories.find((c) => c !== 'All Categories') || 'Electronics',
        price: '',
        quantity: '',
        lowStockThreshold: '5',
      });
    }
    setErrors({});
    setTouched({});
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // If field has already been touched, validate immediately
    if (touched[name]) {
      const validation = validateProduct(
        updated,
        existingProducts,
        productToEdit ? productToEdit.id : null
      );
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name],
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateProduct(
      formData,
      existingProducts,
      productToEdit ? productToEdit.id : null
    );
    setErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      sku: true,
      category: true,
      price: true,
      quantity: true,
      lowStockThreshold: true,
    });

    const validation = validateProduct(
      formData,
      existingProducts,
      productToEdit ? productToEdit.id : null
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <PackagePlus size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="modal-subtitle">
                {isEditing
                  ? `Update details for SKU: ${productToEdit.sku}`
                  : 'Fill in the information below to add an item to inventory.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group full-width">
              <label htmlFor="prod-name" className="form-label required">
                Product Name
              </label>
              <input
                id="prod-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Mechanical Keyboard"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                autoFocus
              />
              {errors.name && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label htmlFor="prod-sku" className="form-label required">
                SKU (Stock Keeping Unit)
              </label>
              <input
                id="prod-sku"
                name="sku"
                type="text"
                className={`form-input ${errors.sku ? 'input-error' : ''}`}
                placeholder="e.g. ELEC-1002"
                value={formData.sku}
                onChange={handleChange}
                onBlur={() => handleBlur('sku')}
              />
              {errors.sku ? (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.sku}
                </div>
              ) : (
                <span className="form-helper">Must be unique across all products.</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="prod-category" className="form-label required">
                Category
              </label>
              <select
                id="prod-category"
                name="category"
                className={`form-select ${errors.category ? 'input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur('category')}
              >
                <option value="">Select Category</option>
                {categories
                  .filter((cat) => cat !== 'All Categories')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.category}
                </div>
              )}
            </div>

            {/* Unit Price */}
            <div className="form-group">
              <label htmlFor="prod-price" className="form-label required">
                Unit Price ($)
              </label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">$</span>
                <input
                  id="prod-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input prefixed ${errors.price ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  onBlur={() => handleBlur('price')}
                />
              </div>
              {errors.price && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.price}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="prod-quantity" className="form-label required">
                Stock Quantity
              </label>
              <input
                id="prod-quantity"
                name="quantity"
                type="number"
                step="1"
                min="0"
                className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                onBlur={() => handleBlur('quantity')}
              />
              {errors.quantity && (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.quantity}
                </div>
              )}
            </div>

            {/* Low Stock Threshold */}
            <div className="form-group full-width">
              <label htmlFor="prod-threshold" className="form-label required">
                Low-Stock Threshold
              </label>
              <input
                id="prod-threshold"
                name="lowStockThreshold"
                type="number"
                step="1"
                min="0"
                className={`form-input ${errors.lowStockThreshold ? 'input-error' : ''}`}
                placeholder="5"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                onBlur={() => handleBlur('lowStockThreshold')}
              />
              {errors.lowStockThreshold ? (
                <div className="form-error-msg">
                  <AlertCircle size={13} /> {errors.lowStockThreshold}
                </div>
              ) : (
                <span className="form-helper">
                  Triggers low stock warnings when quantity is at or below this level.
                </span>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
