// src/App.jsx
import React, { useEffect, useState } from "react";
import ItemList from "./components/ItemList";
import NewItemForm from "./components/NewItemForm";

function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    sku: "",
    size: "",
    quantity: "",
    warehouseId: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [whRes, itemRes] = await Promise.all([
        fetch("http://localhost:8080/api/warehouses"),
        fetch("http://localhost:8080/api/items"),
      ]);

      if (!whRes.ok || !itemRes.ok) {
        throw new Error("Failed to load data");
      }

      const [whData, itemData] = await Promise.all([
        whRes.json(),
        itemRes.json(),
      ]);

      setWarehouses(whData);
      setItems(itemData);
    } catch (err) {
      console.error("Error: Failed to load items", err);
    }
  }

  // DELETE
  async function handleDeleteItem(id) {
    try {
      const response = await fetch(`http://localhost:8080/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // ----- EDIT SUPPORT -----
  function handleStartEdit(item) {
    setEditingItem(item);
    setEditForm({
      id: item.id,
      name: item.name,
      sku: item.sku,
      size: item.size,
      quantity: item.quantity,
      warehouseId: item.warehouse?.id || "",
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  async function handleUpdateItem(e) {
    e.preventDefault();

    const payload = {
      id: editForm.id,
      name: editForm.name,
      sku: editForm.sku,
      size: editForm.size,
      quantity: editForm.quantity,
      warehouse: {
        id: editForm.warehouseId,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/items/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updated = await response.json();

      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setEditingItem(null);
    } catch (err) {
      console.error("Error updating item", err);
    }
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  // ----- RENDER -----
  return (
    <div className="page">
      <header className="page-header">
        <h1>Inventory Warehouse Dashboard</h1>
        <p className="tagline">Full stack flow: React → Spring Boot → PostgreSQL</p>
      </header>

      <main className="layout">
        {/* Warehouses */}
        <section className="card card-wide">
          <h2 className="section-title">Warehouses</h2>
          <ul className="warehouse-list">
            {warehouses.map((wh) => (
              <li key={wh.id}>
                <strong>{wh.name}</strong>
                <div>
                  {wh.location}, NC
                  <span className="capacity-badge">
                    Max Capacity: {wh.maxCapacity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Items table */}
        <section className="card card-wide">
          <ItemList
            items={items}
            onDelete={handleDeleteItem}
            onEdit={handleStartEdit}
          />
        </section>

        {/* Edit panel */}
        {editingItem && (
          <section className="card card-wide edit-panel">
            <h2 className="section-title">Edit Item</h2>
            <form className="form-grid" onSubmit={handleUpdateItem}>
              <label>
                Name
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                SKU
                <input
                  name="sku"
                  value={editForm.sku}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Size
                <input
                  name="size"
                  value={editForm.size}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <label>
                Warehouse
                <select
                  name="warehouseId"
                  value={editForm.warehouseId}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="edit-actions">
                <button className="btn btn-primary" type="submit">
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* New item form (whatever you already had) */}
        <section className="card card-wide">
          <NewItemForm
            warehouses={warehouses}
            onCreated={loadData}
          />
        </section>
      </main>
    </div>
  );
}

export default App;