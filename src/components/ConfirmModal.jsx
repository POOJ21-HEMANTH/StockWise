import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon icon-danger">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="modal-title">Delete Product</h2>
              <p className="modal-subtitle">Confirm inventory deletion</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-confirm">
          <p>
            Are you sure you want to remove <strong>"{product.name}"</strong> (SKU:{' '}
            <code>{product.sku}</code>) from your inventory?
          </p>
          <div className="warning-callout">
            <AlertTriangle size={15} />
            <span>This action cannot be undone. Current stock of {product.quantity} units will be cleared.</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            <span>Delete Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}
