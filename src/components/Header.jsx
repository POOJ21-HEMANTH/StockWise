import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';

export default function Header({ onAddNew, onResetDemoData }) {
  return (
    <header className="app-header">
      <div className="header-titles">
        <h1 className="page-title">Retail Inventory Dashboard</h1>
        <p className="page-subtitle">
          Real-time stock monitoring, inventory valuation, and catalog control
        </p>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-secondary btn-header-reset"
          onClick={onResetDemoData}
          title="Restore initial retail sample inventory"
        >
          <RotateCcw size={15} />
          <span className="hide-on-mobile">Reset Demo Data</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddNew}
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
}
