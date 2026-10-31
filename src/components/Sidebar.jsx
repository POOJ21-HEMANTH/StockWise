import React from 'react';
import {
  Boxes,
  LayoutDashboard,
  AlertTriangle,
  RotateCcw,
  GraduationCap,
  Database,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  lowStockCount,
  onResetDemoData,
  onOpenAgileInfo
}) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Boxes size={24} className="brand-icon" />
        </div>
        <div className="brand-info">
          <span className="brand-name">StockWise</span>
          <span className="brand-tag">SEPM Prototype</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">INVENTORY</div>
        <button
          type="button"
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard & Stock</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'low-stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('low-stock')}
        >
          <AlertTriangle size={18} />
          <span>Low Stock Alerts</span>
          {lowStockCount > 0 && (
            <span className="nav-badge danger-pill">{lowStockCount}</span>
          )}
        </button>

        <div className="nav-group-label">PROJECT DETAILS</div>
        <button
          type="button"
          className="nav-item"
          onClick={onOpenAgileInfo}
        >
          <GraduationCap size={18} />
          <span>Agile & SEPM Info</span>
        </button>
      </nav>

      {/* Sidebar Footer / Persistence status */}
      <div className="sidebar-footer">
        <div className="storage-status-card">
          <div className="storage-header">
            <Database size={14} className="text-success" />
            <span className="storage-title">Browser LocalStorage</span>
          </div>
          <p className="storage-text">Auto-synced across page refreshes</p>
          <button
            type="button"
            className="btn btn-outline btn-sm reset-demo-btn"
            onClick={onResetDemoData}
            title="Restore default sample retail products"
          >
            <RotateCcw size={13} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
