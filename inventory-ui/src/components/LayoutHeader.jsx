// inventory-ui\src\components\LayoutHeader.jsx
// ---Reusable top header with nav and admin toggle.---
import React from "react";

function LayoutHeader({ isAdmin, onAdminLogin }) {
  return (
    <header className="page-header">
      <div className="top-nav">
        <span className="nav-title">Inventory Admin Dashboard</span>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#warehouses">Warehouses</a>
          <a href="#items">Items</a>
        </nav>
        <button className="btn btn-admin" type="button" onClick={onAdminLogin}>
          {isAdmin ? "Admin: ON" : "Admin Login"}
        </button>
      </div>
      <p className="tagline">
        Full stack flow: React → Spring Boot → PostgreSQL
      </p>
    </header>
  );
}

export default LayoutHeader;