import { Link } from "react-router-dom";

const groups = [
  { title: "Explore", links: [["Products", "/#products"], ["Applications", "/#solutions"], ["Energy insights", "/#insights"]] },
  { title: "Company", links: [["About us", "/#about"], ["Contact", "/#contact"], ["My cart", "/cart"]] },
];

export default function Footer() {
  return (
    <footer className="bg-[#101722] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.5fr_1fr_1fr] lg:px-12 lg:py-16">
        <div><Link to="/" className="text-3xl font-black italic tracking-[-0.09em] text-rose-500">Shop<span className="text-white">Sphere</span></Link><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Thoughtful products and reliable energy solutions for the places where life happens.</p><p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-300">Powering everyday confidence</p></div>
        {groups.map((group) => <div key={group.title}><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white">{group.title}</h2><ul className="mt-5 space-y-3">{group.links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-slate-400 transition hover:text-white">{label}</a></li>)}</ul></div>)}
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12"><span>© {new Date().getFullYear()} ShopSphere. All rights reserved.</span><span>Designed for dependable everyday power.</span></div></div>
    </footer>
  );
}
