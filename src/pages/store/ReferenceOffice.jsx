import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  CreditCard,
  FolderOpen,
  Gift,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Package,
  Pencil,
  Shapes,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import "../../reference-school.css";
import "../../reference-office.css";
const categories = [
  "All",
  "Office Supplies",
  "File & Storage",
  "Desk Organisers",
  "Paper Products",
  "Writing Instruments",
  "Office Tools",
  "Desk Accessories",
  "Others",
];
const brandNames = [
  "Kokuyo",
  "Muji",
  "Faber-Castell",
  "Pilot",
  "Stabilo",
  "Others",
];
const shortcuts = [
  ["Office Essentials", BriefcaseBusiness, "All"],
  ["File & Storage", FolderOpen, "File & Storage"],
  ["Writing Instruments", Pencil, "Writing Instruments"],
  ["Desk Organisers", ShoppingBag, "Desk Organisers"],
  ["Paper Products", ClipboardList, "Paper Products"],
  ["Office Tools", Shapes, "Office Tools"],
  ["More", MoreHorizontal, "Others"],
];
const colourOptions = [
  ["Navy", "#062655"],
  ["Blue", "#10a5ce"],
  ["Pink", "#ef94de"],
  ["Red", "#ff182e"],
  ["Yellow", "#ffbd24"],
];
const order = [
  1, 10, 11, 5, 12, 15, 14, 17, 20, 16, 18, 19, 7, 8, 3, 4, 2, 6, 9, 13,
].map((n) => "office-" + n);
const tiles = {
  "office-1": 0,
  "office-10": 1,
  "office-11": 2,
  "office-5": 3,
  "office-12": 4,
  "office-15": 5,
  "office-14": 6,
  "office-17": 7,
  "office-20": 8,
  "office-16": 9,
  "office-18": 10,
  "office-19": 11,
  "office-7": 12,
  "office-8": 13,
  "office-3": 14,
  "office-4": 15,
  "office-2": 16,
  "office-6": 17,
  "office-9": 18,
  "office-13": 4,
  4: 8,
  18: 3,
  20: 10,
  23: 16,
};
function groupFor(p) {
  const n = p.name.toLowerCase();
  if (/folder|file|wallet|envelope/.test(n)) return "File & Storage";
  if (/organis|pen cup|pen holder/.test(n)) return "Desk Organisers";
  if (/paper|notebook|sticky/.test(n)) return "Paper Products";
  if (/pen|pencil|marker|highlighter/.test(n) && !/dispenser/.test(n))
    return "Writing Instruments";
  if (/stapler|punch|scissor|dispenser/.test(n)) return "Office Tools";
  if (/clip|staple/.test(n)) return "Desk Accessories";
  if (/glue/.test(n)) return "Office Supplies";
  return "Others";
}
export default function ReferenceOffice() {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const [category, setCategory] = useState("All"),
    [brands, setBrands] = useState([]),
    [prices, setPrices] = useState([]),
    [colour, setColour] = useState(""),
    [availability, setAvailability] = useState([]),
    [sort, setSort] = useState("Featured"),
    [page, setPage] = useState(1),
    [query, setQuery] = useState(""),
    [closed, setClosed] = useState([]);
  const choose = (value) => {
    setCategory(value);
    setPage(1);
  };
  const toggle = (setter, values, value) => {
    setter(
      values.includes(value)
        ? values.filter((x) => x !== value)
        : [...values, value],
    );
    setPage(1);
  };
  const reset = () => {
    setCategory("All");
    setBrands([]);
    setPrices([]);
    setColour("");
    setAvailability([]);
    setQuery("");
    setPage(1);
  };
  let list = products.filter(
    (p) =>
      !["Draft", "Archived"].includes(p.status) &&
      ["Office", "Desk & Organisers"].includes(p.category) &&
      (category === "All" || groupFor(p) === category) &&
      (!query ||
        (p.name + " " + p.brand).toLowerCase().includes(query.toLowerCase())) &&
      (!brands.length ||
        brands.some((b) =>
          b === "Others"
            ? !brandNames
                .slice(0, -1)
                .some((name) => name.toLowerCase() === p.brand.toLowerCase())
            : b.toLowerCase() === p.brand.toLowerCase(),
        )) &&
      (!prices.length ||
        prices.some((i) => {
          const price = p.salePrice ?? p.price;
          return i === 0
            ? price < 500
            : i === 1
              ? price >= 500 && price < 1000
              : i === 2
                ? price >= 1000 && price <= 2500
                : price > 2500;
        })) &&
      (!colour ||
        p.variants?.Colour?.some(
          (c) => c.toLowerCase() === colour.toLowerCase(),
        )) &&
      (!availability.includes("In Stock") || p.stock > 0) &&
      (!availability.includes("On Sale") || p.salePrice != null),
  );
  list = [...list].sort((a, b) =>
    sort === "Price: low to high"
      ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      : sort === "Price: high to low"
        ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        : sort === "Top rated"
          ? b.rating - a.rating
          : (order.includes(a.id) ? order.indexOf(a.id) : 99) -
            (order.includes(b.id) ? order.indexOf(b.id) : 99),
  );
  const pages = Math.ceil(list.length / 20),
    current = Math.min(page, Math.max(1, pages));
  const heading = (name) => (
    <button
      className="sc-filter-heading"
      aria-expanded={!closed.includes(name)}
      onClick={() =>
        setClosed(
          closed.includes(name)
            ? closed.filter((x) => x !== name)
            : [...closed, name],
        )
      }
    >
      {name}
      {closed.includes(name) ? (
        <ChevronDown size={15} />
      ) : (
        <ChevronUp size={15} />
      )}
    </button>
  );
  return (
    <div className="reference-shop reference-school reference-office">
      <ReferenceHeader
        home
        active="OFFICE"
        onSearch={(value) => {
          setQuery(value);
          setPage(1);
        }}
      />
      <section className="of-hero">
        <div className="of-hero-copy">
          <h1>
            Office<span>.</span>
          </h1>
          <h2>
            Organise Today.
            <br />
            Create Tomorrow.
          </h2>
          <p>
            All your office essentials
            <br />
            in one place.
          </p>
        </div>
        <div className="of-hero-note">
          Work
          <br />
          Organise
          <br />
          Create
          <br />
          Achieve.<span>♥</span>
        </div>
      </section>
      <nav className="of-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={12} />
        <span>Office</span>
      </nav>
      <section className="sc-shortcuts of-shortcuts">
        <nav aria-label="Office categories">
          {shortcuts.map(([label, Icon, value]) => (
            <button
              key={label}
              className={category === value && value !== "All" ? "active" : ""}
              onClick={() => choose(value)}
            >
              <Icon size={23} />
              {label}
              {label === "More" && <ArrowRight size={14} />}
            </button>
          ))}
        </nav>
      </section>
      <main className="sc-main of-main">
        <aside className="sc-filters">
          <h2 className="of-filter-title">Filter your search</h2>
          <section>
            {heading("Category")}
            {!closed.includes("Category") &&
              categories.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={category === name}
                    onChange={() => choose(category === name ? "All" : name)}
                  />
                  {name}
                </label>
              ))}
          </section>
          <section>
            {heading("Brand")}
            {!closed.includes("Brand") &&
              brandNames.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={brands.includes(name)}
                    onChange={() => toggle(setBrands, brands, name)}
                  />
                  {name}
                </label>
              ))}
          </section>
          <section>
            {heading("Price")}
            {!closed.includes("Price") &&
              [
                "Under Rs. 500",
                "Rs. 500 - 1,000",
                "Rs. 1,000 - 2,500",
                "Over Rs. 2,500",
              ].map((name, i) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={prices.includes(i)}
                    onChange={() => toggle(setPrices, prices, i)}
                  />
                  {name}
                </label>
              ))}
          </section>
          <section>
            {heading("Colour")}
            {!closed.includes("Colour") && (
              <div className="sc-colours">
                {colourOptions.map(([name, color]) => (
                  <button
                    key={name}
                    aria-label={"Colour: " + name}
                    aria-pressed={colour === name}
                    title={name}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setColour(colour === name ? "" : name);
                      setPage(1);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
          <section>
            {heading("Availability")}
            {!closed.includes("Availability") &&
              ["In Stock", "On Sale"].map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={availability.includes(name)}
                    onChange={() => toggle(setAvailability, availability, name)}
                  />
                  {name}
                </label>
              ))}
          </section>
          {(category !== "All" ||
            brands.length > 0 ||
            prices.length > 0 ||
            colour ||
            availability.length > 0 ||
            query) && (
            <button className="sc-clear" onClick={reset}>
              Clear filters
            </button>
          )}
        </aside>
        <div className="sc-results">
          <div className="sc-toolbar">
            <span role="status">
              {list.length
                ? `Showing ${(current - 1) * 20 + 1}–${Math.min(current * 20, list.length)} of ${list.length} products`
                : "No matching products"}
            </span>
            <label>
              Sort by:{" "}
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                {[
                  "Featured",
                  "Price: low to high",
                  "Price: high to low",
                  "Top rated",
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          {catalogStatus === "loading" ? (
            <p role="status">Loading office essentials…</p>
          ) : catalogStatus === "error" ? (
            <div className="sc-empty">
              <h2>We couldn’t load the office collection.</h2>
              <button onClick={refreshProducts}>Try again</button>
            </div>
          ) : (
            <>
              <div className="sc-grid">
                {list.slice((current - 1) * 20, current * 20).map((p) => {
                  const tile = tiles[p.id] ?? 0;
                  return (
                    <article className="sc-card" key={p.id}>
                      <div className="sc-picture">
                        <Link to={"/product/" + p.slug} aria-label={p.name}>
                          <div
                            role="img"
                            aria-label={p.name}
                            style={{
                              backgroundImage:
                                "url('/images/office-product-grid.png')",
                              backgroundSize: "400% 500%",
                              backgroundPosition: `${((tile % 4) * 100) / 3}% ${Math.floor(tile / 4) * 25}%`,
                            }}
                          />
                        </Link>
                        <button
                          aria-label={"Save " + p.name}
                          aria-pressed={wishlist.includes(p.id)}
                          onClick={() => toggleWishlist(p.id)}
                        >
                          <Heart
                            size={18}
                            fill={
                              wishlist.includes(p.id) ? "currentColor" : "none"
                            }
                          />
                        </button>
                      </div>
                      <div className="sc-card-copy">
                        <Link to={"/product/" + p.slug}>{p.name}</Link>
                        <p>{p.variants?.Size?.[0]?.replace("Â·", "·")}</p>
                        <strong>{money(p.salePrice ?? p.price)}</strong>
                        <div className="sc-rating">
                          <span aria-label={`${p.rating} out of 5 stars`}>
                            {[0, 1, 2, 3, 4].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={
                                  i < Math.round(p.rating)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </span>
                          <small>({p.reviewCount})</small>
                        </div>
                        <button
                          className="sc-add"
                          aria-label={"Add " + p.name + " to bag"}
                          disabled={!p.stock}
                          onClick={() => addToCart(p)}
                        >
                          <ShoppingBag size={20} />
                          <i />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              {!list.length && (
                <div className="sc-empty">
                  <h2>No matching office essentials</h2>
                  <p>Try another filter to find what your desk needs.</p>
                  <button onClick={reset}>Clear filters</button>
                </div>
              )}
              {pages > 1 && (
                <nav className="sc-pages" aria-label="Product pages">
                  <button
                    aria-label="Previous page"
                    disabled={current === 1}
                    onClick={() => setPage(current - 1)}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  {Array.from({ length: pages }, (_, i) => (
                    <button
                      key={i}
                      className={current === i + 1 ? "active" : ""}
                      aria-current={current === i + 1 ? "page" : undefined}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    aria-label="Next page"
                    disabled={current === pages}
                    onClick={() => setPage(current + 1)}
                  >
                    <ArrowRight size={18} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <div className="of-trust">
        {[
          [Truck, "Islandwide Delivery"],
          [Gift, "Free delivery over Rs. 5,000"],
          [CreditCard, "Secure Payments"],
          [Package, "Easy Returns"],
          [MessageCircle, "WhatsApp Support"],
        ].map(([Icon, label]) => (
          <div key={label}>
            <Icon size={26} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <ReferenceFooter />
    </div>
  );
}
