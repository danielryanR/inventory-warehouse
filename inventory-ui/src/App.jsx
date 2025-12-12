// src/App.jsx
import React, { useEffect, useState } from "react";
import LayoutHeader from "./components/LayoutHeader.jsx";
import WarehouseSummary from "./components/WarehouseSummary.jsx";
import ItemList from "./components/ItemList.jsx";
import NewItemForm from "./components/NewItemForm.jsx";

const API = "http://localhost:8080";

function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);

  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    sku: "",
    size: "",
    quantity: 0,
    warehouseId: "",
  });

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  const [transferItem, setTransferItem] = useState(null);
  const [transferForm, setTransferForm] = useState({
    warehouseId: "",
    quantity: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function readError(res) {
    // Try to extract useful backend info (text or JSON)
    const text = await res.text();
    if (!text) return `Request failed (${res.status})`;

    try {
      const json = JSON.parse(text);
      // Spring Boot error format: { status, error, message, path, ... }
      return json.message || json.error || text;
    } catch {
      return text; // plain string error
    }
  }

  async function loadData() {
    try {
      const [whRes, itemRes] = await Promise.all([
        fetch(`${API}/api/warehouses`),
        fetch(`${API}/api/items`),
      ]);

      if (!whRes.ok) throw new Error(await readError(whRes));
      if (!itemRes.ok) throw new Error(await readError(itemRes));

      const [whData, itemData] = await Promise.all([whRes.json(), itemRes.json()]);
      setWarehouses(Array.isArray(whData) ? whData : []);
      setItems(Array.isArray(itemData) ? itemData : []);
    } catch (err) {
      console.error("Load error:", err);
      alert(err.message || "Could not load data (check backend).");
    }
  }

  function handleAdminLogin() {
    const pwd = window.prompt("Enter admin password");
    if (pwd === "admin123") {
      setIsAdmin(true);
      alert("Admin mode enabled.");
    } else if (pwd !== null) {
      alert("Incorrect password.");
    }
  }

  async function handleCreateItem(newItem) {
    try {
      const wid = Number(newItem.warehouseId);
      const qty = Number(newItem.quantity);

      if (!Number.isFinite(wid) || wid <= 0) {
        alert("Select a warehouse.");
        return;
      }
      if (!Number.isFinite(qty) || qty < 0) {
        alert("Quantity must be 0 or more.");
        return;
      }

      const payload = {
        name: newItem.name,
        sku: newItem.sku,
        description: newItem.description || "",
        size: newItem.size,
        quantity: qty,
        imageUrl: newItem.imageUrl || null,
        warehouse: { id: wid },
      };

      const res = await fetch(`${API}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readError(res));

      const created = await res.json();
      setItems((prev) => [...prev, created]);
    } catch (err) {
      console.error("Create error:", err);
      alert(err.message || "Could not create item.");
    }
  }

  async function handleDeleteItem(id, name) {
    if (!isAdmin) {
      alert("Admin login required to delete items.");
      return;
    }

    const ok = window.confirm(`Delete "${name}" from inventory?`);
    if (!ok) return;

    try {
      const res = await fetch(`${API}/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await readError(res));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Could not delete item.");
    }
  }

  function handleStartEdit(item) {
    if (!isAdmin) {
      alert("Admin login required to edit items.");
      return;
    }

    setEditingItem(item);
    setEditForm({
      id: item.id,
      name: item.name || "",
      sku: item.sku || "",
      size: item.size || "",
      quantity: Number(item.quantity || 0),
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

    if (!isAdmin) {
      alert("Admin login required to edit items.");
      return;
    }

    const wid = Number(editForm.warehouseId);
    const qty = Number(editForm.quantity);

    if (!Number.isFinite(wid) || wid <= 0) {
      alert("Select a warehouse.");
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      alert("Quantity must be 0 or more.");
      return;
    }

    const original = items.find((i) => i.id === editForm.id);

    const payload = {
      id: editForm.id,
      name: editForm.name,
      sku: editForm.sku,
      description: original?.description || "",
      size: editForm.size,
      quantity: qty,
      imageUrl: original?.imageUrl || null,
      warehouse: { id: wid },
    };

    try {
      const res = await fetch(`${API}/api/items/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readError(res));

      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      setEditingItem(null);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message || "Could not update item.");
    }
  }

  function handleCancelEdit() {
    setEditingItem(null);
  }

  function openTransferModal(item) {
    if (!isAdmin) {
      alert("Admin login required to transfer items.");
      return;
    }
    setTransferItem(item);
    setTransferForm({ warehouseId: "", quantity: 1 });
  }

  function closeTransferModal() {
    setTransferItem(null);
  }

  function handleTransferFormChange(e) {
    const { name, value } = e.target;
    setTransferForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  // ✅ Transfer: DON'T try res.json() (transfer might return Item but we don't need it)
  // ✅ Also show backend error body so we stop guessing
  async function handleTransfer(itemId, targetWarehouseId, qty) {
    const url = `${API}/api/items/${itemId}/transfer?targetWarehouseId=${encodeURIComponent(
      targetWarehouseId
    )}&quantity=${encodeURIComponent(qty)}`;

    try {
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error(await readError(res));

      await loadData();
    } catch (err) {
      console.error("Transfer error:", err);
      alert(err.message || "Transfer failed.");
      throw err; // so submit handler can choose whether to close modal
    }
  }

  async function handleTransferSubmit(e) {
    e.preventDefault();
    if (!transferItem) return;

    const targetId = Number(transferForm.warehouseId);
    const qty = Number(transferForm.quantity);

    if (!Number.isFinite(targetId) || targetId <= 0) {
      alert("Select a target warehouse.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }
    if (qty > Number(transferItem.quantity || 0)) {
      alert("Cannot transfer more than available quantity.");
      return;
    }

    try {
      await handleTransfer(transferItem.id, targetId, qty);
      closeTransferModal(); // ✅ only close on success
    } catch {
      // keep modal open so user can adjust
    }
  }

  const visibleItems =
    selectedWarehouseId === "all"
      ? items
      : items.filter((i) => i.warehouse && i.warehouse.id === Number(selectedWarehouseId));

  return (
    <div className="page">
      <LayoutHeader isAdmin={isAdmin} onAdminLogin={handleAdminLogin} />

      <main id="dashboard" className="layout">
        <WarehouseSummary
          warehouses={warehouses}
          selectedWarehouseId={selectedWarehouseId}
          onChangeWarehouse={setSelectedWarehouseId}
        />

        <section id="items" className="card card-wide">
          <h2 className="section-title">Items</h2>

          <p className="section-subtitle">
            {visibleItems.length} items shown, total units{" "}
            {visibleItems.reduce((sum, i) => sum + Number(i.quantity || 0), 0)}
          </p>

          <ItemList
            items={visibleItems}
            onDelete={handleDeleteItem}
            onEdit={handleStartEdit}
            isAdmin={isAdmin}
            onTransfer={openTransferModal}
          />
        </section>

        {editingItem && (
          <section className="card card-wide edit-panel">
            <h2 className="section-title">Edit Item</h2>
            <form className="form-grid" onSubmit={handleUpdateItem}>
              <label>
                Name
                <input name="name" value={editForm.name} onChange={handleEditChange} required />
              </label>

              <label>
                SKU
                <input name="sku" value={editForm.sku} onChange={handleEditChange} required />
              </label>

              <label>
                Size
                <input name="size" value={editForm.size} onChange={handleEditChange} />
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
                <button className="btn btn-secondary" type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

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
                  <button className="btn btn-secondary" type="button" onClick={closeTransferModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="card card-wide">
          <NewItemForm warehouses={warehouses} onCreate={handleCreateItem} isSubmitting={false} />
        </section>
      </main>
    </div>
  );
}

export default App;