import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  stockStatus,
  onStockStatusChange,
  onResetFilters,
  totalResults,
  totalProducts
}) {
  const isFiltered = search !== '' || category !== 'All Categories' || stockStatus !== 'All';

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="category-select" className="filter-label">
            <Filter size={14} /> Category:
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock status filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="status-select" className="filter-label">Status:</label>
          <select
            id="status-select"
            className="filter-select"
            value={stockStatus}
            onChange={(e) => onStockStatusChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Reset filters button */}
        {isFiltered && (
          <button
            type="button"
            className="btn btn-secondary btn-sm reset-btn"
            onClick={onResetFilters}
            title="Reset filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="filter-meta">
        <span className="results-badge">
          Showing <strong>{totalResults}</strong> of <strong>{totalProducts}</strong> products
        </span>
      </div>
    </div>
  );
}
