// src/App.jsx  ---Top-level React app---
import React, { useEffect, useState } from "react";
import LayoutHeader from "./components/LayoutHeader.jsx";
import WarehouseSummary from "./components/WarehouseSummary.jsx";
import ItemList from "./components/ItemList.jsx";
import NewItemForm from "./components/NewItemForm.jsx";

function App() {
  // ---- STATE: warehouses, items, edit state, filters, admin mode ---
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

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  // state for the transfer modal
  const [transferItem, setTransferItem] = useState(null);
  const [transferForm, setTransferForm] = useState({
    warehouseId: "",
    quantity: 1,
  });

  // ----- EFFECT: initial load of warehouses + items ---
  useEffect(() => {
    loadData();
  }, []);

  // ---- API: load all warehouses and items from backend ----
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
      alert("Could not load data, check backend.");
    }
  }

  // ----- SIMPLE ADMIN "LOGIN" TO GATE DANGEROUS ACTIONS -----
  function handleAdminLogin() {
    const pwd = window.prompt("Enter admin password");
    if (pwd === "admin123") {
      setIsAdmin(true);
      alert("Admin mode enabled.");
    } else if (pwd !== null) {
      alert("Incorrect password.");
    }
  }

  // ---- CREATE: add a new item to a specific warehouse -----
  async function handleCreateItem(newItem) {
    try {
      const payload = {
        name: newItem.name,
        sku: newItem.sku,
        description: newItem.description,
        size: newItem.size,
        quantity: Number(newItem.quantity),
        imageUrl: newItem.imageUrl || null,
        warehouse: {
          id: Number(newItem.warehouseId),
        },
      };

      const response = await fetch("http://localhost:8080/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      const created = await response.json();
      setItems((prev) => [...prev, created]);
    } catch (err) {
      console.error("Error creating item", err);
      alert("Could not create item – check backend logs.");
    }
  }

  // ---- DELETE: remove an item (admin only, with confirm) ----
  async function handleDeleteItem(id, name) {
    if (!isAdmin) {
      alert("Admin login required to delete items.");
      return;
    }

    const ok = window.confirm(`Delete "${name}" from inventory?`);
    if (!ok) return;

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
      alert("Could not delete item – check backend logs.");
    }
  }

  // ---- EDIT: start editing an item  ----
  function handleStartEdit(item) {
    if (!isAdmin) {
      alert("Admin login required to edit items.");
      return;
    }

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

  // ---- EDIT: change 'edit form' fields ---
  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  // ---- TRANSFER: call backend to move quantity between warehouses ----
  async function handleTransfer(itemId, targetWarehouseId, qty) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/items/${itemId}/transfer?targetWarehouseId=${targetWarehouseId}&quantity=${qty}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to transfer item");
      }

      await response.json();
      await loadData(); // refresh both source and target quantities
    } catch (err) {
      console.error("Error transferring item", err);
      alert("Could not transfer item – check backend logs.");
    }
  }

  // ---- TRANSFER MODAL: open with selected item ----
  function openTransferModal(item) {
    if (!isAdmin) {
      alert("Admin login required to transfer items.");
      return;
    }

    setTransferItem(item);
    setTransferForm({
      warehouseId: "",
      quantity: 1,
    });
  }

  // ---------- TRANSFER MODAL: close ----
  function closeTransferModal() {
    setTransferItem(null);
  }

  // ---- TRANSFER MODAL: handle input change (warehouse / quantity) ----
  function handleTransferFormChange(e) {
    const { name, value } = e.target;
    setTransferForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  // ---- TRANSFER MODAL: submit transfer request ----
  async function handleTransferSubmit(e) {
    e.preventDefault();
    if (!transferItem) return;

    if (!transferForm.warehouseId) {
      alert("Select a target warehouse.");
      return;
    }
    if (transferForm.quantity <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }

    await handleTransfer(
      transferItem.id,
      Number(transferForm.warehouseId),
      transferForm.quantity
    );
    closeTransferModal();
  }

  // ---- UPDATE: save changes from the edit form to backend ----
  async function handleUpdateItem(e) {
    e.preventDefault();

    if (!isAdmin) {
      alert("Admin login required to edit items.");
      return;
    }

    const payload = {
      id: editForm.id,
      name: editForm.name,
      sku: editForm.sku,
      size: editForm.size,
      quantity: editForm.quantity,
      warehouse: {
        id: Number(editForm.warehouseId),
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
      alert("Could not update item – check backend logs.");
    }
  }

  // ---- EDIT: cancel edit mode ----
  function handleCancelEdit() {
    setEditingItem(null);
  }

  // ---- DERIVED DATA: filter items by selected warehouse ----
  const visibleItems =
    selectedWarehouseId === "all"
      ? items
      : items.filter(
          (i) => i.warehouse && i.warehouse.id === Number(selectedWarehouseId)
        );

  // ---- RENDER: layout, dashboard, lists, forms, and modals ----
  return (
    <div className="page">
      <LayoutHeader isAdmin={isAdmin} onAdminLogin={handleAdminLogin} />
      <main id="dashboard" className="layout">
        {/* Warehouses section */}
        <WarehouseSummary
  warehouses={warehouses}
  selectedWarehouseId={selectedWarehouseId}
  onChangeWarehouse={setSelectedWarehouseId}
/>

        {/* Items section */}
        <section id="items" className="card card-wide">
          <h2 className="section-title">Items</h2>

          <p className="section-subtitle">
            {visibleItems.length} items shown, total units{" "}
            {visibleItems.reduce((sum, i) => sum + i.quantity, 0)}
          </p>

          <ItemList
            items={visibleItems}
            onDelete={handleDeleteItem}
            onEdit={handleStartEdit}
            isAdmin={isAdmin}
            onTransfer={openTransferModal}
          />
        </section>

        {/* Edit item panel */}
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

        {/* Transfer modal */}
        {transferItem && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Transfer {transferItem.name}</h3>
              <form onSubmit={handleTransferSubmit} className="form-grid">
                <label>
                  Target warehouse
                  <select
                    name="warehouseId"
                    value={transferForm.warehouseId}
                    onChange={handleTransferFormChange}
                    required
                  >
                    <option value="">Select warehouse</option>
                    {warehouses
                      .filter((wh) => wh.id !== transferItem.warehouse?.id)
                      .map((wh) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name}
                        </option>
                      ))}
                  </select>
                </label>

                <label>
                  Quantity to transfer
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={transferItem.quantity}
                    value={transferForm.quantity}
                    onChange={handleTransferFormChange}
                    required
                  />
                </label>

                <div className="edit-actions">
                  <button className="btn btn-primary" type="submit">
                    Transfer
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={closeTransferModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New item form */}
        <section className="card card-wide">
          <NewItemForm
            warehouses={warehouses}
            onCreate={handleCreateItem}
            isSubmitting={false}
          />
        </section>
      </main>
      <footer className="app-footer">
        <p>Full stack flow: React → Spring Boot → PostgreSQL</p>
      </footer>
    </div>
  );
}

export default App;