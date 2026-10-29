import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { extractProducts } from "../Utils/productMapper";
import heroImage from "../assets/energy-hero.png";

const formatPrice = (price) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(price || 0);

const valueCards = [
  { mark: "20+", title: "Years of experience", detail: "Built on decades of practical power expertise." },
  { mark: "01", title: "Made for reliability", detail: "Thoughtful solutions for everyday energy needs." },
  { mark: "∞", title: "Support that stays", detail: "Here to help you choose the right product." },
  { mark: "✓", title: "Quality assured", detail: "Carefully selected products for lasting value." },
];

const insights = [
  { tag: "ENERGY GUIDE", title: "A practical guide to choosing backup power", copy: "Understand capacity, runtime and the features that matter for your space." },
  { tag: "INNOVATION", title: "What’s changing in energy storage", copy: "A closer look at smarter systems and the future of dependable power." },
  { tag: "SUSTAINABILITY", title: "Making every unit of energy count", copy: "Simple ways to build a more efficient, resilient home or workplace." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAllProducts(0, 20).then((response) => {
      if (!response?.success) throw new Error(response?.message || "Products are unavailable right now.");
      if (active) setProducts(extractProducts(response));
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || requestError.message || "Could not load products.");
    }).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <main className="bg-white text-slate-900">
      <section className="relative isolate flex min-h-[590px] items-end overflow-hidden bg-slate-950 sm:min-h-[650px] lg:min-h-[690px]">
        <img src={heroImage} alt="A modern home with a backup energy storage system at dusk" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/5" />
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-16">
          <div className="max-w-3xl text-white">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-rose-200"><span className="h-px w-10 bg-rose-400" />Power for the moments that matter</p>
            <h1 className="max-w-3xl text-4xl font-extrabold uppercase leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">Reliable power.<br />Ready when you are.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-xl sm:leading-8">Explore dependable energy storage and power solutions designed for homes, businesses and everyday applications.</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="#solutions" className="rounded-md bg-rose-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-rose-950/20 transition hover:bg-rose-700">Explore solutions <span aria-hidden="true">↗</span></a><a href="#about" className="rounded-md border border-white/50 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/15">Discover our story</a></div>
          </div>
        </div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/70 md:flex"><span className="h-px w-12 bg-white/40" />Powering everyday confidence</div>
      </section>

      <section id="solutions" className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Find your fit</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Featured products</h2></div><p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Browse products by name and open any item to see its details.</p></div>
        {loading && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-52 animate-pulse bg-slate-100" />)}</div>}
        {!loading && !error && products.length === 0 && <p className="border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No products are available right now.</p>}
        {!loading && products.length > 0 && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((product, index) => (
          <Link to={product.id ? `/products/${product.id}` : "#products"} key={product.id ?? `${product.name}-${index}`} className="group relative flex min-h-52 overflow-hidden bg-slate-900 p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            {product.image && <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-50" />}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/35 to-rose-950/60" />
            <div className="relative mt-auto"><span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-rose-200">Product 0{index + 1}</span><h3 className="line-clamp-2 text-2xl font-bold">{product.name}</h3><span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/85">View product <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span></span></div>
          </Link>
        ))}</div>}
      </section>

      <section id="about" className="bg-[#f5f5f3]">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-12">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">A stronger tomorrow</p><h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Powering progress with dependable energy.</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">We bring practical energy products and thoughtful service together, helping people and businesses stay powered through the everyday and the unexpected.</p><div className="mt-7 flex flex-wrap gap-3"><a href="#why-us" className="rounded-md bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700">Why choose us</a><a href="#contact" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-900">Talk to our team</a></div></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">{valueCards.map((card) => <article key={card.title} className="min-h-40 border border-slate-200 bg-white p-5 sm:min-h-48 sm:p-6"><p className="text-3xl font-extrabold tracking-tight text-rose-600">{card.mark}</p><h3 className="mt-4 font-bold text-slate-900">{card.title}</h3><p className="mt-2 text-sm leading-5 text-slate-500">{card.detail}</p></article>)}</div>
        </div>
      </section>

      <section id="why-us" className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">The difference is in the details</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Why choose ShopSphere?</h2><p className="mt-4 leading-7 text-slate-500">A considered range, straightforward guidance and service you can count on.</p></div>
        <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">{[{icon:"◇",title:"Carefully selected",text:"Solutions chosen with everyday performance in mind."},{icon:"◷",title:"Built for lasting use",text:"Products designed to support dependable operation."},{icon:"⌖",title:"Guidance that helps",text:"Get help finding a solution suited to your needs."},{icon:"↗",title:"Here after purchase",text:"Our team is ready to support you beyond checkout."}].map((item) => <article key={item.title} className="bg-white p-6 sm:p-7"><span className="text-3xl text-rose-600" aria-hidden="true">{item.icon}</span><h3 className="mt-5 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p></article>)}</div>
      </section>

      <section id="products" className="bg-slate-950 text-white">
        <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">Explore the range</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Products & solutions</h2></div><p className="max-w-lg text-sm leading-6 text-slate-300">Browse the latest products available in our store.</p></div>
          {loading && <div className="py-12 text-center text-slate-300">Loading products…</div>}
          {!loading && error && <div role="status" className="rounded border border-white/15 bg-white/5 p-5 text-sm text-slate-200">Products are temporarily unavailable. {error}</div>}
          {!loading && !error && products.length === 0 && <div className="rounded border border-white/15 bg-white/5 p-8 text-center text-slate-300">No products are available right now.</div>}
          {products.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 8).map((product) => <article key={product.id} className="group overflow-hidden bg-white text-slate-900"><Link to={product.id ? `/products/${product.id}` : "#products"} className="block"><div className="flex h-56 items-center justify-center bg-[#f2f2f0]">{product.image ? <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105" /> : <span className="text-sm text-slate-400">Product image coming soon</span>}</div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600">{product.category}</p><h3 className="mt-2 line-clamp-2 min-h-12 font-bold leading-6">{product.name}</h3><div className="mt-4 flex items-center justify-between"><span className="font-bold">{formatPrice(product.price)}</span><span className="text-xl text-rose-600 transition group-hover:translate-x-1" aria-hidden="true">→</span></div></div></Link></article>)}</div>}
          <div className="mt-9 text-center"><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide transition hover:border-rose-400 hover:bg-rose-600">View all products <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section id="insights" className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Ideas for a powered future</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Energy insights</h2></div><a href="#contact" className="text-sm font-bold text-slate-700 hover:text-rose-600">Explore all insights ↗</a></div>
        <div className="grid gap-5 md:grid-cols-3">{insights.map((item, index) => <article key={item.title} className="group border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex h-40 items-end p-5 ${index === 0 ? "bg-gradient-to-br from-rose-700 to-orange-400" : index === 1 ? "bg-gradient-to-br from-slate-900 to-indigo-700" : "bg-gradient-to-br from-emerald-800 to-teal-400"}`}><span className="text-5xl font-black text-white/25">0{index + 1}</span></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-rose-600">{item.tag}</p><h3 className="mt-3 text-lg font-bold leading-6">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</p><a href="#contact" className="mt-5 inline-block text-sm font-bold text-slate-900 group-hover:text-rose-600">Read more →</a></div></article>)}</div>
      </section>

      <section id="contact" className="bg-rose-600"><div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-6 py-12 text-white sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-100">Let’s find the right solution</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">Ready to power your world?</h2><p className="mt-2 text-sm text-white/85">Explore our available products and find the right fit for your needs.</p></div><a href="#products" className="w-fit rounded-sm bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-rose-700 transition hover:bg-slate-100">Explore products ↗</a></div></section>
    </main>
  );
}
