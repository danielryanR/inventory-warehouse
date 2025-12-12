import React from "react";

function LayoutHeader({ isAdmin, onAdminLogin }) {
  return (
    <header className="page-header">

      {/* Top row: Title + Admin Button */}
      <div className="header-row">
        <span className="nav-title">Inventory Admin Dashboard</span>
        <button className="btn btn-admin" type="button" onClick={onAdminLogin}>
          {isAdmin ? "Admin: ON" : "Admin Login"}
        </button>
      </div>

      {/* Middle row: Navigation links centered */}
      <nav className="middle-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#warehouses">Warehouses</a>
        <a href="#items">Items</a>
      </nav>

      {/* Tagline */}
      <p className="tagline">God's Vessel Inc.</p>
    </header>
  );
}

export default LayoutHeader;