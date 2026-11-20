import BrandLogo from "../../components/common/BrandLogo";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  ChevronRight,
  ChevronUp,
  ArrowRight,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import "../../shop-reference.css";
const categories = [
  "All",
  "Pens & Pencils",
  "Notebooks",
  "School Bags",
  "Art Supplies",
  "Desk Organisers",
  "Office Supplies",
  "Craft Paper",
  "Gift Wrap",
  "Gifts",
  "Brands",
];
const categoryMap = {
  "Pens & Pencils": ["Pens"],
  Notebooks: ["Notebooks", "Books", "Journals"],
  "School Bags": ["School"],
  "Art Supplies": ["Art Supplies"],
  "Desk Organisers": ["Desk & Organisers"],
  "Office Supplies": ["Office"],
  "Craft Paper": ["Paper"],
  "Gift Wrap": ["Paper", "Gifts"],
  Gifts: ["Gifts"],
};
const nav = [
  ["Home", "/"],
  ["School", "/category/school"],
  ["Office", "/category/office"],
  ["Stationery", "/shop"],
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
];
export default function ReferenceShop() {
  const { products, wishlist, addToCart, toggleWishlist } = useShop();

  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [brands, setBrands] = useState([]),
    [prices, setPrices] = useState(() => {
      const max = Number(
        new URLSearchParams(window.location.search).get("max"),
      );
      return max === 500
        ? [0]
        : max === 1000
          ? [0, 1]
          : max === 2500
            ? [0, 1, 2]
            : [];
    }),
    [sort, setSort] = useState("Featured"),
    [filtersOpen, setFiltersOpen] = useState(true);
  const preferred = ["2", "1", "3", "4", "school-8", "school-16"];
  const active = products.filter(
    (p) => !["Archived", "Draft"].includes(p.status),
  );
  let list = active.filter(
    (p) =>
      (!categoryMap[category] || categoryMap[category].includes(p.category)) &&
      (!brands.length ||
        brands.some((b) =>
          b === "Atles"
            ? ["atles", "atlas"].includes(p.brand.toLowerCase())
            : b.toLowerCase() === p.brand.toLowerCase(),
        )) &&
      (!prices.length ||
        prices.some((i) => {
          const v = p.salePrice ?? p.price;
          return i === 0
            ? v < 500
            : i === 1
              ? v >= 500 && v < 1000
              : i === 2
                ? v >= 1000 && v <= 2500
                : v > 2500;
        })) &&
      (p.name + " " + p.brand).toLowerCase().includes(query.toLowerCase()),
  );
  list = [...list].sort((a, b) =>
    sort === "Price: low to high"
      ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      : sort === "Price: high to low"
        ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
        : sort === "Top rated"
          ? b.rating - a.rating
          : (preferred.includes(a.id) ? preferred.indexOf(a.id) : 99) -
            (preferred.includes(b.id) ? preferred.indexOf(b.id) : 99),
  );
  const toggle = (setter, values, value) => {
    setter(
      values.includes(value)
        ? values.filter((x) => x !== value)
        : [...values, value],
    );

  };
  const tile = (p) =>
    /highlighter/i.test(p.name)
      ? 2
      : /pen/i.test(p.name) && p.category === "Pens"
        ? 1
        : /organiser/i.test(p.name)
          ? 4
          : /colour|watercolour/i.test(p.name)
            ? 3
            : /journal/i.test(p.name)
              ? 9
              : /gift/i.test(p.name)
                ? 8
                : 0;
  return (
    <div className="reference-shop">
      <ReferenceHeader
        onSearch={(value) => {
          setQuery(value);

        }}
      />
      <section className="rs-hero">
        <div>
          <h1>
            Shop
            <br />
            Stationery<span>.</span>
          </h1>
          <p>For every idea, every day.</p>
        </div>
      </section>
      <main className="rs-main">
        <div className="rs-top">
          <div className="rs-crumb">
            <Link to="/">Home</Link>
            <ChevronRight size={15} />
            <span>Shop</span>
          </div>
          <label className="rs-sort">
            Sort by:{" "}
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);

              }}
            >
              {[
                "Featured",
                "Price: low to high",
                "Price: high to low",
                "Top rated",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="rs-layout">
          <aside className="rs-filters">
            <section>
              <button
                className="rs-filter-heading"
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-expanded={filtersOpen}
              >
                Category
                <ChevronUp
                  style={{ transform: filtersOpen ? "none" : "rotate(180deg)" }}
                  size={20}
                />
              </button>
              {filtersOpen &&
                categories.map((c) => (
                  <label key={c}>
                    <input
                      type="checkbox"
                      checked={category === c}
                      onChange={() => {
                        setCategory(category === c ? "All" : c);

                      }}
                    />
                    {c}
                  </label>
                ))}
            </section>
            <section>
              <h2>Price</h2>
              {[
                "Under Rs. 500",
                "Rs. 500 - 1,000",
                "Rs. 1,000 - 2,500",
                "Over Rs. 2,500",
              ].map((p, i) => (
                <label key={p}>
                  <input
                    type="checkbox"
                    checked={prices.includes(i)}
                    onChange={() => toggle(setPrices, prices, i)}
                  />
                  {p}
                </label>
              ))}
            </section>
            <section>
              <h2>Brand</h2>
              {[
                "Atles",
                "Promate",
                "Smmanee",
              ].map((b) => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={brands.includes(b)}
                    onChange={() => toggle(setBrands, brands, b)}
                  />
                  {b}
                </label>
              ))}
            </section>
          </aside>
          <div className="rs-results">
            <div className="rs-grid">
              {list.map((p) => (
                <article className="rs-card" key={p.id}>
                  <div className="rs-image">
                    <Link to={"/product/" + p.slug} aria-label={p.name}>
                      {/^(pettah|promate)-/.test(p.id) ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : <div
                        role="img"
                        aria-label={p.name}
                        style={{
                          backgroundPosition: `${(tile(p) % 6) * 20}% ${tile(p) >= 6 ? 100 : 0}%`,
                        }}
                      />}
                    </Link>
                    <button
                      className={wishlist.includes(p.id) ? "saved" : ""}
                      aria-label={`Save ${p.name}`}
                      aria-pressed={wishlist.includes(p.id)}
                      onClick={() => toggleWishlist(p.id)}
                    >
                      <Heart
                        size={20}
                        fill={wishlist.includes(p.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="rs-card-copy">
                    <Link className="rs-product-name" to={"/product/" + p.slug}>
                      {p.name}
                    </Link>
                    <p>
                      {p.id === "2"
                        ? "Black"
                        : p.id === "1"
                          ? "A5 - Ruled"
                          : p.id === "3"
                            ? "Set of 4"
                            : p.id === "4"
                              ? "Off White"
                              : p.variants?.Size?.[0]}
                    </p>
                    <strong>{money(p.salePrice ?? p.price)}</strong>
                    {p.reviewCount > 0 && <div className="rs-rating">
                      <span aria-label={`${p.rating} out of 5 stars`}>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star
                            size={16}
                            key={i}
                            fill={i < 4 ? "currentColor" : "none"}
                          />
                        ))}
                      </span>
                      <small>({p.reviewCount})</small>
                    </div>}
                    <button
                      className="rs-add"
                      disabled={!p.stock}
                      aria-label={`Add ${p.name} to bag`}
                      onClick={() => addToCart(p)}
                    >
                      <ShoppingBag size={27} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!list.length && (
              <div className="rs-empty">
                <h2>No matching finds</h2>
                <p>Try another category, brand, or price range.</p>
                <button
                  onClick={() => {
                    setCategory("All");
                    setBrands([]);
                    setPrices([]);
                    setQuery("");
                    setSearch("");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <ReferenceFooter />
    </div>
  );
}

export function ReferenceHeader({ onSearch }) {
  const { cart, wishlist } = useShop();
  const navigate = useNavigate();
  const [search, setSearch] = useState(""),
    [mobile, setMobile] = useState(false);
  return (
    <header className="rs-header site-header">
      <Link to="/" className="rs-logo">
        <BrandLogo />
      </Link>
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        className={mobile ? "rs-nav open" : "rs-nav"}
      >
        {nav.map(([label, to]) => (
          <NavLink
            end={to === "/"}
            key={label}
            to={to}
            onClick={() => setMobile(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <form
        className="rs-search"
        onSubmit={(e) => {
          e.preventDefault();
          if (onSearch) {
            onSearch(search);
          } else {
            navigate("/search?q=" + encodeURIComponent(search));
          }
        }}
      >
        <input
          aria-label="Search products"
          placeholder="Search for notebooks, pens, art supplies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button aria-label="Search">
          <Search size={19} />
        </button>
      </form>
      <div className="rs-actions">
        <Link to="/wishlist" aria-label="Wishlist">
          <Heart />
          {wishlist.length > 0 && <small>{wishlist.length}</small>}
        </Link>
        <Link to="/cart" aria-label="Shopping cart">
          <ShoppingCart />
          <small>{cart.reduce((n, p) => n + p.quantity, 0)}</small>
        </Link>
        <button
          className="rs-menu"
          aria-label="Toggle menu"
          aria-expanded={mobile}
          aria-controls="site-navigation"
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function ReferenceFooter() {
  const { notify } = useShop();
  return (
    <footer className="rs-footer">
      <div className="rs-footer-grid">
        <div className="rs-footer-brand">
          <Link to="/" className="rs-logo">
            <BrandLogo />
          </Link>
          <p>
            Good ideas start somewhere.
            <br />
            Usually on paper.
          </p>
        </div>
        {[
          [
            "SHOP",
            ["All Products", "/shop"],
            ["School", "/category/school"],
            ["Office", "/category/office"],
          ],
          [
            "HELP",
            ["Delivery", "/delivery"],
            ["Returns", "/returns"],
            ["FAQs", "/faq"],
            ["Track Order", "/track-order"],
            ["Privacy Policy", "/privacy"],
            ["Terms of Service", "/terms"],
          ],
          [
            "ABOUT",
            ["Our Story", "/about"],
            ["Contact Us", "/contact"],
            ["My Account", "/account"],
            ["Wishlist", "/wishlist"],
          ],
        ].map(([title, ...links]) => (
          <div key={title}>
            <h3>{title}</h3>
            {links.map(([label, to]) => (
              <Link key={label} to={to}>
                {label}
              </Link>
            ))}
          </div>
        ))}
        <div className="rs-newsletter">
          <h3>JOIN OUR NEWSLETTER</h3>
          <p>Get special offers, new arrivals and inspiration.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notify("Thanks for subscribing!");
              e.target.reset();
            }}
          >
            <input
              type="email"
              required
              aria-label="Newsletter email"
              placeholder="Your email"
            />
            <button aria-label="Subscribe">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
      <div className="rs-footer-bottom">
        <span>© 2026 Paperist. All rights reserved.</span>
        <span>
          Web Design and Development by ACTS Global (Pvt) Ltd <i />
        </span>
      </div>
    </footer>
  );
}
