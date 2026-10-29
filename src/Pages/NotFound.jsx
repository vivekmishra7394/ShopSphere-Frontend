import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">404</p>
      <h1 className="mt-3 text-4xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-600">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white">Go to home</Link>
    </main>
  );
}
