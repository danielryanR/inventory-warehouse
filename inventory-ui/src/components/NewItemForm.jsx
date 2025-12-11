// src/components/NewItemForm.jsx
import { useState } from "react";

function NewItemForm({ warehouses, onCreate, isSubmitting }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    size: "",
    quantity: "",
    warehouseId: "",
    imageUrl: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.name ||
      !form.sku ||
      !form.size ||
      !form.quantity ||
      !form.warehouseId
    ) {
      alert("Please fill out name, SKU, size, quantity, and warehouse.");
      return;
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      size: form.size,
      quantity: Number(form.quantity),
      imageUrl: form.imageUrl || null,
      warehouseId: Number(form.warehouseId),
    };

    await onCreate(payload);

    setForm({
      name: "",
      sku: "",
      description: "",
      size: "",
      quantity: "",
      warehouseId: "",
      imageUrl: "",
    });
  }

  return (
    <section className="panel">
      <h2>Add New Item</h2>
      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder='e.g. "Jehovah Jireh Tee - Black"'
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            SKU
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="GV-JJ-BLK-M"
            />
          </label>
          <label>
            Size
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="M / L / XL"
            />
          </label>
          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Warehouse
            <select
              name="warehouseId"
              value={form.warehouseId}
              onChange={handleChange}
            >
              <option value="">Select warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Image URL (optional)
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.png"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of this shirt"
            />
          </label>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Create Item"}
        </button>
      </form>
    </section>
  );
}

export default NewItemForm;