import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Grid2X2, List, ChevronLeft, ChevronRight, SlidersHorizontal, X, Star } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import "../../notebooks.css";

const categoryNames = ["Notebooks", "Pens", "Planners", "Art Supplies", "Desk & Organisers", "School", "Gifts"];
const tileFor = (p) => {
  const name = p.name.toLowerCase();
  if (/highlighter/.test(name)) return 2;
  if (/mildliner/.test(name)) return 5;
  if (/pencil case/.test(name)) return 11;
  if (/sticky/.test(name)) return 10;
  if (/plant/.test(name)) return 7;
  if (/journal/.test(name)) return 9;
  if (/dot grid/.test(name)) return 6;
  if (/gift/.test(name)) return 8;
  if (/pencil/.test(name)) return 3;
  return { Notebooks: 0, Pens: 1, "Art Supplies": 3, "Desk & Organisers": 4, Office: 4, Gifts: 8, Journals: 9 }[p.category] ?? 6;
};

export default function NotebookCatalog() {
  const { products, wishlist, toggleWishlist, addToCart } = useShop();
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [max, setMax] = useState(5000);
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("Featured");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const [more, setMore] = useState(false);
  const active = products.filter(p => !["Archived", "Draft"].includes(p.status));
  const brands = [...new Set(active.map(p => p.brand))];
  const preferred = ["1", "2", "3", "16", "4", "15", "23", "17", "12", "18", "5"];
  let finds = active.filter(p => (!category || p.category === category) && (!brand || p.brand === brand) && (p.salePrice ?? p.price) <= max && p.rating >= rating && (!availability || (availability === "in" ? p.stock > 0 : p.stock === 0)));
  finds = [...finds].sort((a, b) => sort === "Price: low to high" ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price) : sort === "Price: high to low" ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price) : sort === "Top rated" ? b.rating - a.rating : (preferred.includes(a.id) ? preferred.indexOf(a.id) : 99) - (preferred.includes(b.id) ? preferred.indexOf(b.id) : 99));
  const pages = Math.ceil(finds.length / 12);
  const current = Math.min(page, Math.max(pages, 1));
  const change = (setter, value) => { setter(value); setPage(1); };
  const checks = (options, value, setter) => options.map(([label, key, count]) => <label className="nb-check" key={key}><input type="checkbox" checked={value === key} onChange={() => change(setter, value === key ? "" : key)} /><span>{label}{count !== undefined && ` (${count})`}</span></label>);
  const filters = <>
    <button className="nb-close" onClick={() => setDrawer(false)} aria-label="Close filters"><X size={20} /></button>
    <section><h3>Categories</h3>{checks(categoryNames.map(c => [c, c, active.filter(p => p.category === c).length]), category, setCategory)}</section>
    <section><h3>Price Range</h3><input className="nb-range" aria-label="Maximum price" type="range" min="0" max="10000" step="100" value={max} onChange={e => change(setMax, Number(e.target.value))} /><div className="nb-range-label">Rs. 0 <span>–</span> {money(max)}</div></section>
    <section><h3>Brand</h3>{checks((more ? brands : brands.slice(0, 6)).map(b => [b, b]), brand, setBrand)}{brands.length > 6 && <button className="nb-more" onClick={() => setMore(!more)}>{more ? "Less" : "More"} <ChevronRight size={14} /></button>}</section>
    <section><h3>Rating</h3>{[4.5, 4].map(r => <label className="nb-check" key={r}><input type="checkbox" checked={rating === r} onChange={() => change(setRating, rating === r ? 0 : r)} /><span className="nb-stars">★★★★★</span><span>({active.filter(p => p.rating >= r).length})</span></label>)}</section>
    <section><h3>Availability</h3>{checks([["In Stock", "in"], ["Out of Stock", "out"]], availability, setAvailability)}</section>
  </>;
  return <div className="nb-page">
    <section className="nb-banner"><div><h1>Notebooks<br /><span>for Every Story<i>.</i></span></h1><p>Write. Plan. Create.<br />Organise. Repeat.</p></div></section>
    <div className="nb-body"><div className="nb-breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><Link to="/shop">Shop</Link><ChevronRight size={13} /><span>Notebooks</span></div>
      <aside className={`nb-sidebar ${drawer ? "open" : ""}`}>{filters}</aside>
      <div className="nb-results"><div className="nb-toolbar"><span>{finds.length ? `Showing ${(current - 1) * 12 + 1}–${Math.min(current * 12, finds.length)} of ${finds.length} products` : "No matching products"}</span><button className="nb-filter-toggle" onClick={() => setDrawer(true)}><SlidersHorizontal size={16} /> Filters</button><label className="nb-sort">Sort by: <select aria-label="Sort products" value={sort} onChange={e => change(setSort, e.target.value)}>{["Featured", "Price: low to high", "Price: high to low", "Top rated"].map(s => <option key={s}>{s}</option>)}</select></label><div className="nb-views"><button className={view === "grid" ? "active" : ""} aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 size={17} /> Grid</button><button className={view === "list" ? "active" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}><List size={17} /> List</button><button aria-label="Compact grid" className={view === "compact" ? "active" : ""} onClick={() => setView("compact")}><Grid2X2 size={17} /></button></div></div>
        <div className={`nb-grid nb-${view}`}>{finds.slice((current - 1) * 12, current * 12).map(p => { const tile = tileFor(p); return <article className="nb-card" key={p.id}><div className="nb-picture"><Link to={`/product/${p.slug}`} aria-label={p.name}><div role="img" aria-label={p.name} style={{ backgroundPosition: `${(tile % 6) * 20}% ${tile >= 6 ? 100 : 0}%` }} /></Link><button className={`nb-heart ${wishlist.includes(p.id) ? "saved" : ""}`} aria-label={`Save ${p.name}`} aria-pressed={wishlist.includes(p.id)} onClick={() => toggleWishlist(p.id)}><Heart size={19} fill={wishlist.includes(p.id) ? "currentColor" : "none"} /></button></div><div className="nb-card-info"><Link to={`/product/${p.slug}`} className="nb-name">{p.name}</Link><p>{p.variants?.Size?.[0]}{p.variants?.["Paper Type"]?.[0] ? ` – ${p.variants["Paper Type"][0]}` : ""}</p><strong>{money(p.salePrice ?? p.price)}</strong><div className="nb-review"><span aria-label={`${p.rating} out of 5 stars`}>{Array.from({length: 5}, (_, i) => <Star key={i} size={13} fill={i < Math.round(p.rating) ? "currentColor" : "none"} />)}</span><small>({p.reviewCount})</small></div><button className="nb-bag" disabled={!p.stock} aria-label={`Add ${p.name} to bag`} onClick={() => addToCart(p)}><ShoppingBag size={18} /></button></div></article>; })}</div>
        {!finds.length && <div className="nb-empty"><h2>No products found</h2><p>Try another category or increase the price range.</p></div>}
        {pages > 1 && <nav className="nb-pagination" aria-label="Product pages"><button disabled={current === 1} aria-label="Previous page" onClick={() => setPage(current - 1)}><ChevronLeft size={19} /></button>{Array.from({length: pages}, (_, i) => <button key={i} className={current === i + 1 ? "active" : ""} aria-current={current === i + 1 ? "page" : undefined} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button disabled={current === pages} aria-label="Next page" onClick={() => setPage(current + 1)}><ChevronRight size={19} /></button></nav>}
      </div>
    </div>
  </div>;
}
