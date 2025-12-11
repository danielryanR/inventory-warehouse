// src/components/ItemList.jsx
function ItemList({ items, selectedWarehouseId, onDelete }) {
  const visibleItems = selectedWarehouseId
    ? items.filter((item) => {
        const warehouseId =
          item.warehouseId ?? item.warehouse?.id ?? item.warehouse_id;
        return Number(warehouseId) === Number(selectedWarehouseId);
      })
    : items;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Items</h2>
        {selectedWarehouseId ? (
          <span className="muted">
            Showing items in warehouse #{selectedWarehouseId}
          </span>
        ) : (
          <span className="muted">Showing all items</span>
        )}
      </div>

      {visibleItems.length === 0 ? (
        <p className="muted">No items to display.</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Warehouse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => {
              const warehouseName =
                item.warehouse?.name ??
                (item.warehouseId
                  ? `Warehouse #${item.warehouseId}`
                  : "N/A");
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.size}</td>
                  <td
                    className={
                      item.quantity !== undefined && item.quantity <= 5
                        ? "low-stock"
                        : ""
                    }
                  >
                    {item.quantity}
                  </td>
                  <td>{warehouseName}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default ItemList;