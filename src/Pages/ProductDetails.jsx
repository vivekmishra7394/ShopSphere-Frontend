import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { extractSingleProduct } from "../Utils/productMapper";
import { useCart } from "../Context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await getProductById(id);

        if (!response?.success) {
          throw new Error(
            response?.message || "Product fetch nahi ho paaya."
          );
        }

        const item = extractSingleProduct(response);

        if (!item) {
          throw new Error("Product response ka format valid nahi hai.");
        }

        if (active) {
          setProduct(item);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Product load karte waqt error aaya."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="p-12 text-center text-gray-600">
        Loading product details...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Product unavailable
        </h1>

        <p className="mt-3 text-gray-600">
          {error || "Requested product nahi mila."}
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white"
        >
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 md:px-12">
      <Link to="/" className="text-sm font-medium text-rose-600">
        ← Back to products
      </Link>

      <section className="mt-8 grid gap-10 rounded-2xl bg-white p-6 md:grid-cols-2 md:p-10">
        <div className="flex min-h-72 items-center justify-center rounded-xl bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[450px] w-full object-contain p-6"
            />
          ) : (
            <span className="text-gray-400">No product image</span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 whitespace-pre-line leading-7 text-gray-600">
            {product.description || "No description available."}
          </p>

          <button
            type="button"
            onClick={() => addItem(product)}
            className="mt-6 w-fit rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700"
          >
            Add to cart
          </button>

          {product.stock != null && (
            <p className="mt-4 text-sm text-gray-500">
              Available quantity: {product.stock}
            </p>
          )}

          <p className="mt-8 text-sm text-gray-500">
            Product ID: {product.id ?? id}
          </p>
        </div>
      </section>
    </main>
  );
}

