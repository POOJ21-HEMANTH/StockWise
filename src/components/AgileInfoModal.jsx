import React from 'react';
import { X, GraduationCap, CheckCircle2, GitBranch, ShieldCheck, Cpu } from 'lucide-react';

export default function AgileInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon icon-primary">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="modal-title">SEPM Project Architecture & Agile Documentation</h2>
              <p className="modal-subtitle">AI-Assisted Agile Development and Continuous Integration</p>
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

        <div className="modal-body sepm-content">
          <section className="sepm-section">
            <h3 className="sepm-section-title">
              <Cpu size={16} /> Project Overview
            </h3>
            <p>
              <strong>StockWise</strong> is a responsive retail inventory management system designed using
              Agile user stories and automated continuous verification. It tracks SKUs, stock levels, valuations,
              and low-stock triggers with zero external runtime dependencies.
            </p>
          </section>

          <section className="sepm-section">
            <h3 className="sepm-section-title">
              <GitBranch size={16} /> Agile Software Engineering Principles
            </h3>
            <div className="sepm-cards-grid">
              <div className="sepm-card">
                <h4>1. Incremental Delivery</h4>
                <p>Features decomposed into small, testable sprints (Dashboard &rarr; Product CRUD &rarr; Real-time Validation).</p>
              </div>
              <div className="sepm-card">
                <h4>2. Test-Driven Verification</h4>
                <p>Automated Vitest suite verifying critical calculations (total inventory valuation, status thresholds, SKU uniqueness).</p>
              </div>
              <div className="sepm-card">
                <h4>3. Usability & User Feedback</h4>
                <p>Instant visual feedback with status badges, reactive stats, inline errors, and non-destructive delete confirmation.</p>
              </div>
              <div className="sepm-card">
                <h4>4. Data Persistence</h4>
                <p>Client-side localStorage abstraction ensuring state survives page reloads without requiring complex servers.</p>
              </div>
            </div>
          </section>

          <section className="sepm-section">
            <h3 className="sepm-section-title">
              <ShieldCheck size={16} /> CI/CD & Automated Verification Pipeline
            </h3>
            <ul className="sepm-list">
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span><strong>Unit Testing (Vitest):</strong> 20 automated tests validating business rules, edge cases, and statistics.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span><strong>Static Build Verification:</strong> Production bundle compilation with Vite tree-shaking and zero warnings.</span>
              </li>
              <li>
                <CheckCircle2 size={15} className="text-success" />
                <span><strong>Zero-Cost Deployment Ready:</strong> Standalone static assets ready for GitHub Pages, Vercel, or Netlify.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
