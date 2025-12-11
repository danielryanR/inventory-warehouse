// src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

import WarehouseList from "./components/WarehouseList";
import ItemList from "./components/ItemList";
import NewItemForm from "./components/NewItemForm";

const API_BASE_URL = "http://localhost:8080/api";

function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load warehouses and items on first render
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setLoadingError("");

        const [warehouseRes, itemRes] = await Promise.all([
          fetch(`${API_BASE_URL}/warehouses`),
          fetch(`${API_BASE_URL}/items`),
        ]);

        if (!warehouseRes.ok) {
          throw new Error("Failed to load warehouses");
        }
        if (!itemRes.ok) {
          throw new Error("Failed to load items");
        }

        const warehouseData = await warehouseRes.json();
        const itemData = await itemRes.json();

        setWarehouses(warehouseData);
        setItems(itemData);
      } catch (err) {
        console.error(err);
        setLoadingError(err.message || "Error loading data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // CREATE item
  async function handleCreateItem(newItem) {
    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create item");
      }

      const created = await res.json();
      setItems((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("Error creating item: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE item
  async function handleDeleteItem(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete item");
      }

      // Remove from state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting item: " + err.message);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Inventory Warehouse Dashboard</h1>
        <p className="muted">
          Full stack flow: React → Spring Boot → PostgreSQL → back to React.
        </p>
      </header>

      {loading && <div className="banner info">Loading data...</div>}
      {loadingError && (
        <div className="banner error">Error: {loadingError}</div>
      )}

      <main className="layout">
        <div className="layout-left">
          <WarehouseList
            warehouses={warehouses}
            selectedWarehouseId={selectedWarehouseId}
            onSelect={setSelectedWarehouseId}
          />
        </div>

        <div className="layout-right">
          <ItemList
            items={items}
            selectedWarehouseId={selectedWarehouseId}
            onDelete={handleDeleteItem}
          />
          <NewItemForm
            warehouses={warehouses}
            onCreate={handleCreateItem}
            isSubmitting={submitting}
          />
        </div>
      </main>
    </div>
  );
}

export default App;