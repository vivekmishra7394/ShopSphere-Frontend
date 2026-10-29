import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await signup(form);

      if (!response?.success) {
        throw new Error(response?.message || "Signup failed.");
      }

      setMessage(response.message || "Account created successfully.");

      navigate("/login", {
        state: { signupMessage: response.message || "Signup successful." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Account create nahi ho paaya."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f5f3] px-4 py-14">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/[0.06] sm:p-10"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Join the community</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Create account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Join us to explore our products.
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-rose-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-rose-500"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-rose-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-rose-600">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
