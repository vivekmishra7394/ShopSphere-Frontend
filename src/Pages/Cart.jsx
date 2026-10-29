import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(value || 0);

export default function Cart() {
  const { items, subtotal, removeItem, setQuantity, clearCart } = useCart();

  if (!items.length) return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
      <p className="mt-3 text-gray-600">Browse the store and add something you like.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white">Browse products</Link>
    </main>
  );

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-6 py-10 md:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
        <button onClick={clearCart} className="text-sm font-medium text-rose-600 hover:text-rose-700">Clear cart</button>
      </div>
      <div className="mt-8 divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-white px-5">
        {items.map((item) => (
          <article key={item.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              {item.image ? <img src={item.image} alt={item.name} className="h-full w-full rounded-lg object-contain p-2" /> : <span className="text-xs text-gray-400">No image</span>}
            </div>
            <div className="min-w-0 flex-1">
              <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-rose-600">{item.name}</Link>
              <p className="mt-1 text-sm text-gray-500">{money(item.price)} each</p>
            </div>
            <label className="text-sm text-gray-600">Qty
              <input aria-label={`Quantity for ${item.name}`} type="number" min="1" value={item.quantity} onChange={(event) => setQuantity(item.id, event.target.value)} className="ml-2 w-20 rounded-lg border border-gray-300 px-3 py-2" />
            </label>
            <strong className="min-w-24 text-right text-gray-900">{money(item.price * item.quantity)}</strong>
            <button onClick={() => removeItem(item.id)} className="text-sm font-medium text-red-600">Remove</button>
          </article>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-sm">
          <div className="flex justify-between text-lg font-bold text-gray-900"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <p className="mt-2 text-sm text-gray-500">Shipping and taxes are calculated at checkout.</p>
          <button type="button" disabled className="mt-5 w-full rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white opacity-60">Checkout coming soon</button>
        </div>
      </div>
    </main>
  );
}

