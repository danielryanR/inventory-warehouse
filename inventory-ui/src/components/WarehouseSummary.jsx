// "Shows all warehouses and lets me filter items by warehouse."
import React from "react";

function WarehouseSummary({
  warehouses,
  selectedWarehouseId,
  onChangeWarehouse,
}) {
  return (
    <section id="warehouses" className="card card-wide">
      <h2 className="section-title">Warehouses</h2>

      <div className="warehouse-toolbar">
        <label>
          Filter items by warehouse:
          <select
            value={selectedWarehouseId}
            onChange={(e) => onChangeWarehouse(e.target.value)}
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className="warehouse-list">
        {warehouses.map((wh) => (
          <li key={wh.id}>
            <strong>{wh.name}</strong>
            <div>
              {wh.location}, NC{" "}
              <span className="capacity-badge">
                Max Capacity: {wh.maxCapacity}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WarehouseSummary;