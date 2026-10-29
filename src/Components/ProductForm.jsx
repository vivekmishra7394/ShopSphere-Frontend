import { useState } from "react";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: ""
};

export default function ProductForm({ onSubmit, editingProduct, onCancel }) {
  const [form, setForm] = useState(editingProduct || emptyProduct);

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity)
    });
    if (!editingProduct) setForm(emptyProduct);
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg bg-white p-5 shadow-sm md:grid-cols-2">
      <input name="name" value={form.name} onChange={changeField} placeholder="Product name" className="rounded border p-2" required />
      <input name="category" value={form.category} onChange={changeField} placeholder="Category" className="rounded border p-2" required />
      <input name="price" value={form.price} onChange={changeField} type="number" min="0" step="0.01" placeholder="Price" className="rounded border p-2" required />
      <input name="stockQuantity" value={form.stockQuantity} onChange={changeField} type="number" min="0" placeholder="Stock quantity" className="rounded border p-2" required />
      <input name="description" value={form.description} onChange={changeField} placeholder="Description" className="rounded border p-2 md:col-span-2" required />
      <div className="flex gap-2 md:col-span-2">
        <button className="rounded bg-indigo-600 px-4 py-2 text-white">
          {editingProduct ? "Update product" : "Add product"}
        </button>
        {editingProduct && <button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancel</button>}
      </div>
    </form>
  );
}
