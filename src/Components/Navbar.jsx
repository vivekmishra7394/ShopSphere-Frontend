import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { getCurrentUser, logout } from "../services/authService";
import ConfirmDialog from "./ConfirmDialog";

export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(() => sessionStorage.getItem("inventory-user-role"));
  const [loggingOut, setLoggingOut] = useState(false);
  const [authError, setAuthError] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const refreshSession = () => {
      setRole(sessionStorage.getItem("inventory-user-role"));
      getCurrentUser().then(() => active && setIsLoggedIn(true)).catch(() => {
        if (active) {
          setIsLoggedIn(false);
          sessionStorage.removeItem("inventory-user-role");
          setRole(null);
        }
      });
    };
    refreshSession();
    window.addEventListener("auth:changed", refreshSession);
    return () => {
      active = false;
      window.removeEventListener("auth:changed", refreshSession);
    };
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setAuthError("");
    try {
      const response = await logout();
      if (response?.success === false) throw new Error(response.message || "Logout failed.");
      setIsLoggedIn(false);
      sessionStorage.removeItem("inventory-user-role");
      setRole(null);
      window.dispatchEvent(new Event("auth:changed"));
      navigate("/login", { replace: true });
    } catch (error) {
      setAuthError(error.response?.data?.message || error.message || "Logout could not be completed.");
    } finally {
      setLoggingOut(false);
    }
  };

  const navClass = ({ isActive }) => `relative py-2 text-[13px] font-bold uppercase tracking-wide transition after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-rose-600 after:transition-all ${isActive ? "text-rose-700 after:w-full" : "text-slate-800 after:w-0 hover:text-rose-700 hover:after:w-full"}`;

  const links = <>
    <a href="/#about" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">About</a>
    <a href="/#products" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">Products</a>
    <a href="/#solutions" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">Applications</a>
    <a href="/#insights" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">Insights</a>
    <a href="/#contact" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">Contact</a>
    {role === "ADMIN" && isLoggedIn && <NavLink to="/users" className={navClass}>Users</NavLink>}
    <Link to="/cart" className="py-2 text-[13px] font-bold uppercase tracking-wide text-slate-800 transition hover:text-rose-700">Cart{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
    {isLoggedIn ? <button type="button" onClick={() => setConfirmLogout(true)} disabled={loggingOut} className="w-fit bg-rose-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-rose-700 disabled:opacity-60">Logout</button> : <Link to="/login" className="w-fit bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-rose-600">Sign in</Link>}
  </>;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#e51d2a] text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-2.5 text-xs sm:px-8 sm:text-sm lg:px-12">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-7"><span className="inline-flex items-center gap-2"><span aria-hidden="true">☎</span> Customer support</span><span className="hidden items-center gap-2 sm:inline-flex"><span aria-hidden="true">✉</span> Help choosing a solution</span><span className="hidden items-center gap-2 md:inline-flex"><span aria-hidden="true">⌖</span> Serving customers across India</span></div>
          <div className="flex items-center gap-4 text-sm font-bold" aria-label="Social links"><a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-white/75">f</a><a href="https://www.linkedin.com" aria-label="LinkedIn" className="hover:text-white/75">in</a><a href="https://www.instagram.com" aria-label="Instagram" className="hover:text-white/75">◎</a></div>
        </div>
      </div>
      <div className="border-b border-slate-100 shadow-[0_3px_12px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
          <Link to="/" className="flex shrink-0 items-center gap-4" aria-label="ShopSphere home">
            <span className="text-3xl font-black italic tracking-[-0.09em] text-rose-600 sm:text-4xl">Shop<span className="text-slate-900">Sphere</span><span className="ml-1 align-top text-[9px] not-italic tracking-normal text-slate-500">®</span></span>
            <span className="hidden h-12 w-px bg-slate-300 sm:block" />
            <span className="hidden items-center gap-2 sm:flex"><strong className="text-4xl font-extrabold leading-none text-rose-600">20</strong><span className="max-w-20 text-[11px] font-black uppercase leading-3 text-slate-800">years of<br />trusted service</span></span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label="Main navigation">{links}</nav>
          <button type="button" className="flex h-11 w-11 items-center justify-center border border-slate-200 text-2xl text-slate-800 lg:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? "×" : "☰"}</button>
        </div>
        {mobileOpen && <nav className="flex flex-col gap-2 border-t border-slate-100 px-6 py-5 lg:hidden" aria-label="Mobile navigation">{links}</nav>}
      </div>
      {authError && <p role="alert" className="bg-rose-50 px-5 py-2 text-right text-sm text-rose-700">{authError}</p>}
      <ConfirmDialog open={confirmLogout} title="Log out of ShopSphere?" message="You’ll need to sign in again to access your account." confirmLabel="Log out" danger busy={loggingOut} onCancel={() => setConfirmLogout(false)} onConfirm={async () => { await handleLogout(); setConfirmLogout(false); }} />
    </header>
  );
}
