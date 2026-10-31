import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import FilterBar from './components/FilterBar';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ConfirmModal from './components/ConfirmModal';
import AgileInfoModal from './components/AgileInfoModal';
import Toast from './components/Toast';

import { loadProducts, saveProducts, resetToSampleData } from './utils/storage';
import {
  calculateDashboardStats,
  filterProducts,
  formatCurrency,
  formatNumber
} from './utils/inventoryUtils';
import { INITIAL_CATEGORIES } from './constants/sampleData';

export default function App() {
  // Main state: inventory items loaded from localStorage
  const [products, setProducts] = useState(() => loadProducts());

  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [stockStatus, setStockStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [isAgileInfoOpen, setIsAgileInfoOpen] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  // Sync products to localStorage whenever state changes
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Dynamic categories list (initial categories + any custom ones added by user)
  const allCategories = useMemo(() => {
    const set = new Set(INITIAL_CATEGORIES);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Live dashboard summary metrics
  const stats = useMemo(() => {
    return calculateDashboardStats(products);
  }, [products]);

  // Live filtered products list
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      search,
      category,
      stockStatus,
    });
  }, [products, search, category, stockStatus]);

  // Navigation tab handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'low-stock') {
      setStockStatus('Low Stock');
    } else {
      setStockStatus('All');
    }
  };

  // Add new product clicked
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  // Edit product clicked
  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (productData) => {
    if (productToEdit) {
      // Editing existing product
      const updated = products.map((item) =>
        item.id === productToEdit.id ? { ...item, ...productData } : item
      );
      setProducts(updated);
      setToast({
        type: 'success',
        message: `Updated product "${productData.name}" (SKU: ${productData.sku})`,
      });
    } else {
      // Adding new product
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productData,
      };
      setProducts([newProduct, ...products]);
      setToast({
        type: 'success',
        message: `Added new product "${productData.name}" to inventory.`,
      });
    }
    setIsProductModalOpen(false);
    setProductToEdit(null);
  };

  // Delete product prompt
  const handleOpenDeleteConfirm = (product) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const remaining = products.filter((item) => item.id !== productToDelete.id);
    setProducts(remaining);
    setToast({
      type: 'info',
      message: `Deleted "${productToDelete.name}" from inventory.`,
    });
    setIsConfirmModalOpen(false);
    setProductToDelete(null);
  };

  // Reset sample data
  const handleResetDemo = () => {
    const seeded = resetToSampleData();
    setProducts(seeded);
    setSearch('');
    setCategory('All Categories');
    setStockStatus('All');
    setActiveTab('dashboard');
    setToast({
      type: 'success',
      message: 'Restored original retail sample inventory data.',
    });
  };

  // Quick low stock filter toggle
  const handleFilterLowStock = () => {
    setStockStatus('Low Stock');
    setActiveTab('low-stock');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setStockStatus('All');
    setActiveTab('dashboard');
  };

  return (
    <div className="app-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        lowStockCount={stats.lowStockCount}
        onResetDemoData={handleResetDemo}
        onOpenAgileInfo={() => setIsAgileInfoOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          onAddNew={handleOpenAddModal}
          onResetDemoData={handleResetDemo}
        />

        <main className="app-content">
          {/* 4 Summary Dashboard Metrics Cards */}
          <section className="stats-grid" aria-label="Inventory Overview Statistics">
            <StatCard
              title="Total Products"
              value={formatNumber(stats.totalProducts)}
              subtitle="Catalog items tracked"
              icon={Package}
              variant="default"
            />
            <StatCard
              title="Total Stock Units"
              value={formatNumber(stats.totalStockUnits)}
              subtitle="Units across all SKUs"
              icon={Boxes}
              variant="info"
            />
            <StatCard
              title="Total Inventory Value"
              value={formatCurrency(stats.totalInventoryValue)}
              subtitle="Current asset valuation"
              icon={DollarSign}
              variant="success"
            />
            <StatCard
              title="Low Stock Alerts"
              value={formatNumber(stats.lowStockCount)}
              subtitle={
                stats.outOfStockCount > 0
                  ? `${stats.outOfStockCount} completely out of stock`
                  : 'At or below alert threshold'
              }
              icon={AlertTriangle}
              variant={stats.lowStockCount > 0 ? 'warning' : 'default'}
              isClickable={stats.lowStockCount > 0}
              onClick={stats.lowStockCount > 0 ? handleFilterLowStock : undefined}
            />
          </section>

          {/* Low Stock Attention Banner (if any products need re-ordering) */}
          {stats.lowStockCount > 0 && stockStatus !== 'Low Stock' && (
            <div className="low-stock-alert-banner" role="alert">
              <div className="alert-banner-left">
                <AlertTriangle size={20} />
                <span>
                  <strong>Inventory Notice:</strong> {stats.lowStockCount} product
                  {stats.lowStockCount > 1 ? 's are' : ' is'} currently at or below
                  their minimum reorder threshold.
                </span>
              </div>
              <button
                type="button"
                className="alert-banner-btn"
                onClick={handleFilterLowStock}
              >
                View Low-Stock Items <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            </div>
          )}

          {/* Product Inventory Section */}
          <section className="inventory-section">
            {/* Filter & Search Bar */}
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              categories={allCategories}
              stockStatus={stockStatus}
              onStockStatusChange={(status) => {
                setStockStatus(status);
                if (status === 'Low Stock') setActiveTab('low-stock');
                else setActiveTab('dashboard');
              }}
              onResetFilters={handleResetFilters}
              totalResults={filteredProducts.length}
              totalProducts={products.length}
            />

            {/* Inventory Table */}
            <ProductTable
              products={filteredProducts}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteConfirm}
              onAddNew={handleOpenAddModal}
              hasFilters={search !== '' || category !== 'All Categories' || stockStatus !== 'All'}
              onResetFilters={handleResetFilters}
            />
          </section>
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        existingProducts={products}
        categories={allCategories}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        product={productToDelete}
      />

      {/* SEPM / Agile Project Info Modal */}
      <AgileInfoModal
        isOpen={isAgileInfoOpen}
        onClose={() => setIsAgileInfoOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
