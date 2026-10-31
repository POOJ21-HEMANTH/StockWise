# StockWise — Retail Inventory Management System

> **SEPM College Project Prototype:**  
> *"AI-Assisted Agile Development and Continuous Integration of a Retail Inventory Management System"*

A responsive, high-reliability retail inventory management web application built with **React**, **Vite**, and clean modern CSS. StockWise empowers store managers to monitor catalog health, track real-time valuations, configure reorder thresholds, and manage products without requiring an external backend or database setup.

---

## 🚀 Key Features

1. **Live Dashboard Metrics**:
   - Total products cataloged
   - Total units in stock
   - Total inventory asset valuation ($\sum \text{price} \times \text{quantity}$)
   - Low-stock and out-of-stock items counter
2. **Product Catalog Table**:
   - Name, unique SKU, Category badge, Unit price, Stock quantity, and Status badge.
   - Low-stock threshold display per product.
3. **Product CRUD (Create, Read, Update, Delete)**:
   - **Add**: Modal with comprehensive validation.
   - **Edit**: Pre-populated modal preserving historical SKU uniqueness rules.
   - **Delete**: Safe confirmation prompt modal with impact warnings.
4. **Search & Multi-Criteria Filtering**:
   - Live search by product title or SKU code.
   - Filter by retail category (*Electronics, Apparel, Groceries, Home Goods, etc.*).
   - Filter by stock status (*In Stock, Low Stock, Out of Stock*).
5. **Visual Low-Stock Indicators**:
   - Prominent alert banner when items fall below safe threshold.
   - Highlighted amber table rows and warning badges for quick visual triage.
6. **Zero-Backend Persistent Storage**:
   - Automatically saves all changes to browser `localStorage`.
   - Seeded with 10 realistic retail demo items upon first visit.
   - One-click "Reset Demo Data" option in sidebar and header.
7. **Strict Field Validation**:
   - Required non-empty product names ($\ge 2$ characters).
   - Unique SKU codes (alphanumeric, dashes, underscores).
   - Nonnegative unit prices ($\ge 0$).
   - Nonnegative integer quantities ($\ge 0$, no fractions).
   - Configurable low-stock alert thresholds.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 18 | Declarative component model, predictable state flow |
| **Build Tool & Bundler** | Vite 6 | Sub-second hot module reloading, instant production builds |
| **Icons** | Lucide React | Clean, professional SVG icons with zero runtime overhead |
| **Styling** | Modern CSS | CSS custom properties, responsive flex/grid layouts, no heavy frameworks |
| **Testing** | Vitest | Lightning-fast test runner validating inventory calculations & rules |
| **Persistence** | Browser `localStorage` | Zero configuration, offline persistence, easy college grading |

---

## 📦 How to Install and Run Locally

### 1. Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v24)
- **npm** (comes bundled with Node.js)

### 2. Installation
Open your terminal in the project directory (`stockwise-inventory`) and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Run Automated Tests
```bash
npm test
```
All unit test suites will execute and report passing assertions.

### 5. Production Build Verification
```bash
npm run build
```
Generates an optimized static bundle in the `dist/` directory.

---

## 🧪 Automated Testing (SEPM / CI Verification)

StockWise features unit tests covering core business logic:
- `src/tests/inventoryUtils.test.js`:
  - Total product count computation
  - Total inventory stock summation
  - Real-time valuation logic ($\text{price} \times \text{qty}$)
  - Low-stock and out-of-stock categorization
  - Name and SKU substring matching
  - Category and status filtering logic
  - Currency and number formatting
- `src/tests/validation.test.js`:
  - Required fields and minimum name length
  - SKU uniqueness check (new products vs self on edit)
  - Nonnegative price enforcement
  - Whole-number quantity enforcement
  - Threshold validation

---

## 📁 Project Structure

```text
stockwise-inventory/
├── index.html                   # Entry HTML document
├── package.json                 # Dependencies and npm scripts
├── vite.config.js               # Vite & Vitest configuration
├── .gitignore                   # Ignored files (node_modules, dist)
├── README.md                    # Project documentation & presentation guide
├── src/
│   ├── main.jsx                 # React root bootstrap
│   ├── App.jsx                  # Main application state orchestrator
│   ├── index.css                # Polished retail design system & styles
│   ├── constants/
│   │   └── sampleData.js        # 10 realistic sample retail items & categories
│   ├── utils/
│   │   ├── storage.js           # LocalStorage persistence & reset handlers
│   │   ├── inventoryUtils.js    # Statistics formulas, status logic & filtering
│   │   └── validation.js        # Form validation rules & SKU uniqueness checks
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar & storage status
│   │   ├── Header.jsx           # Top app bar with action triggers
│   │   ├── StatCard.jsx         # Summary KPI cards
│   │   ├── FilterBar.jsx        # Search and multi-filter controls
│   │   ├── ProductTable.jsx     # Data table with low-stock highlights
│   │   ├── ProductModal.jsx     # Add/Edit product modal dialog
│   │   ├── ConfirmModal.jsx     # Delete confirmation prompt dialog
│   │   ├── AgileInfoModal.jsx   # College SEPM Agile documentation modal
│   │   └── Toast.jsx            # Action notification banners
│   └── tests/
│       ├── inventoryUtils.test.js
│       └── validation.test.js
```

---

## 🎓 Agile SEPM Presentation Talking Points

1. **User Stories Fulfilled**:
   - *"As a store manager, I want to see low-stock items at a glance so that I can reorder before stockouts occur."*
   - *"As an inventory clerk, I want system validation to block duplicate SKUs so that stock records remain accurate."*
   - *"As a retail supervisor, I want to see live total inventory valuation so that I can report asset value immediately."*
2. **Fail-Safe Design**:
   - Accidental deletions are guarded with a confirmation prompt.
   - LocalStorage auto-recovers with sample data if corrupted or empty.
   - Non-destructive form inputs with immediate validation feedback.
