// src/components/WarehouseList.jsx 
// ---dynamic list of warehouses---
function WarehouseList({ warehouses, selectedWarehouseId, onSelect }) {
  return (
    <section className="panel">
      <h2>Warehouses</h2>
      {warehouses.length === 0 ? (
        <p className="muted">No warehouses found.</p>
      ) : (
        <ul className="warehouse-list">
          {warehouses.map((wh) => (
            <li
              key={wh.id}
              className={
                wh.id === Number(selectedWarehouseId)
                  ? "warehouse-item selected"
                  : "warehouse-item"
              }
              onClick={() => onSelect(String(wh.id))}
            >
              <div className="warehouse-name">{wh.name}</div>
              <div className="warehouse-meta">
                <span>{wh.location}</span>
                <span>Max Capacity: {wh.maxCapacity}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WarehouseList;