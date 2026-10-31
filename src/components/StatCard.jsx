import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, variant = 'default', onClick, isClickable = false }) {
  return (
    <div
      className={`stat-card stat-card-${variant} ${isClickable ? 'stat-card-clickable' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick && onClick();
        }
      }}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon-wrapper stat-icon-${variant}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
