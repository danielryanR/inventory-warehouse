// src/ItemList.jsx
import React from "react";

function ItemList({ items, onDelete, onEdit }) {
  return (
    <div className="card">
      <h2 className="section-title">Items</h2>
      <p className="section-subtitle">Showing all items</p>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Warehouse</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.size}</td>
              <td>{item.quantity}</td>
              <td>{item.warehouse?.name}</td>
              <td className="actions-col">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;