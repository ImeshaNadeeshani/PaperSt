import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  BookOpen,
  Pencil,
  Backpack,
  Ruler,
  Palette,
  BottleWine,
  Shapes,
  MoreHorizontal,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import "../../reference-school.css";
const groups = [
  "All",
  "Notebooks",
  "Pens & Pencils",
  "School Bags",
  "Math & Geometry",
  "Art Supplies",
  "Lunch & Bottles",
  "School Sets",
  "Study Tools",
  "Others",
];
const shortcuts = [
  ["Notebooks", BookOpen],
  ["Pens & Pencils", Pencil],
  ["School Bags", Backpack],
  ["Math & Geometry", Ruler],
  ["Art Supplies", Palette],
  ["Lunch & Bottles", BottleWine],
  ["School Sets", Shapes],
  ["More", MoreHorizontal],
];
const brands = [
  "Kokuyo",
  "Muji",
  "Stabilo",
  "Faber-Castell",
  "Pilot",
  "Others",
];
const colours = [
  ["Navy", "#062655"],
  ["Blue", "#16acd5"],
  ["Pink", "#f59db9"],
  ["Red", "#ff0e45"],
  ["Yellow", "#ffc400"],
  ["Natural", "#fff1dd"],
];
const preferred = [
  "1",
  "3",
  "2",
  "4",
  "school-8",
  "9",
  "school-12",
  "school-20",
  "18",
  "school-15",
  "5",
  "school-9",
  "school-16",
  "school-7",
];
function groupFor(p) {
  const n = (p.name + " " + p.subcategory).toLowerCase();
  if (/notebook|exercise|journal/.test(n)) return "Notebooks";
  if (/geometry|ruler|graph/.test(n)) return "Math & Geometry";
  if (/backpack|school bag/.test(n)) return "School Bags";
  if (/bottle|lunch/.test(n)) return "Lunch & Bottles";
  if (/crayon|colour|watercolour|sketch|drawing|paint/.test(n))
    return "Art Supplies";
  if (/pen|pencil|highlighter|marker/.test(n) && !/case|sharpener/.test(n))
    return "Pens & Pencils";
  if (/set|kit/.test(n)) return "School Sets";
  if (/organis|sticky|scissor|eraser|sharpener|case/.test(n))
    return "Study Tools";
  return "Others";
}
function tileFor(p) {
  const n = p.name.toLowerCase();
  if (/notebook|exercise|journal/.test(n)) return 0;
  if (/highlighter/.test(n)) return 1;
  if (/colour pencil/.test(n)) return 12;
  if (/watercolour/.test(n)) return 4;
  if (/geometry/.test(n)) return 6;
  if (/backpack/.test(n)) return 5;
  if (/bottle/.test(n)) return 7;
  if (/a4|paper pack/.test(n)) return 8;
  if (/sticky/.test(n)) return 9;
  if (/scissor/.test(n)) return 10;
  if (/pencil case/.test(n)) return 11;
  if (/crayon/.test(n)) return 13;
  if (/drawing|sketch/.test(n)) return 14;
  if (/ruler/.test(n)) return 15;
  if (/organis/.test(n)) return 3;
  if (/pen/.test(n)) return 2;
  return null;
}
function SchoolArt({ product }) {
  const tile = tileFor(product);
  return tile === null ? (
    <img src={product.images?.[0]} alt={product.name} />
  ) : (
    <div
      role="img"
      aria-label={product.name}
      style={{
        backgroundPosition: `${((tile % 4) * 100) / 3}% ${(Math.floor(tile / 4) * 100) / 3}%`,
      }}
    />
  );
}
export default function ReferenceSchool() {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    notify,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const [category, setCategory] = useState("All"),
    [selectedBrands, setBrands] = useState([]),
    [prices, setPrices] = useState([]),
    [colour, setColour] = useState(""),
    [paper, setPaper] = useState([]),
    [sort, setSort] = useState("Featured"),
    [page, setPage] = useState(1),
    [query, setQuery] = useState(""),
    [closed, setClosed] = useState([]);
  const active = products.filter(
    (p) =>
      !["Draft", "Archived"].includes(p.status) &&
      ([
        "School",
        "Pens",
        "Notebooks",
        "Art Supplies",
        "Desk & Organisers",
        "Paper",
        "Books",
        "Journals",
      ].includes(p.category) ||
        p.id === "18"),
  );
  let list = active.filter(
    (p) =>
      (category === "All" || groupFor(p) === category) &&
      (!query ||
        (p.name + " " + p.brand).toLowerCase().includes(query.toLowerCase())) &&
      (!selectedBrands.length ||
        selectedBrands.some((b) =>
          b === "Others"
            ? !brands
                .slice(0, -1)
                .some((x) => x.toLowerCase() === p.brand.toLowerCase())
            : b.toLowerCase() === p.brand.toLowerCase(),
        )) &&
      (!prices.length ||
        prices.some((i) => {
          const value = p.salePrice ?? p.price;
          return i === 0
            ? value < 500
            : i === 1
              ? value >= 500 && value < 1000
              : i === 2
                ? value >= 1000 && value <= 2500
                : value > 2500;
        })) &&
      (!colour ||
        p.variants?.Colour?.some(
          (c) => c.toLowerCase() === colour.toLowerCase(),
        )) &&
      (!paper.length ||
        paper.some((type) => p.variants?.["Paper Type"]?.includes(type))),
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
  const pages = Math.ceil(list.length / 16),
    current = Math.min(page, Math.max(pages, 1));
  const toggle = (setter, values, value) => {
    setter(
      values.includes(value)
        ? values.filter((x) => x !== value)
        : [...values, value],
    );
    setPage(1);
  };
  const choose = (c) => {
    setCategory(c);
    setPage(1);
  };
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
        <ChevronDown size={16} />
      ) : (
        <ChevronUp size={16} />
      )}
    </button>
  );
  const reset = () => {
    setCategory("All");
    setBrands([]);
    setPrices([]);
    setColour("");
    setPaper([]);
    setQuery("");
    setPage(1);
  };
  return (
    <div className="reference-shop reference-school">
      <ReferenceHeader
        home
        active="SCHOOL"
        onSearch={(value) => {
          setQuery(value);
          setPage(1);
        }}
      />
      <section className="sc-hero">
        <div className="sc-hero-copy">
          <div className="sc-crumb">
            <Link to="/">Home</Link> › School
          </div>
          <h1>
            School<span>.</span>
          </h1>
          <p>
            Everything they need
            <br />
            for a brighter year.
          </p>
        </div>
        <div className="sc-hero-note">
          Study
          <br />
          Create
          <br />
          Learn
          <br />
          Grow.
          <br />
          Repeat.<span>♥</span>
        </div>
      </section>
      <section className="sc-shortcuts">
        <p>
          School essentials for every bright idea. From notebooks to pencils,
          get everything for a smarter, brighter year.
        </p>
        <nav aria-label="School categories">
          {shortcuts.map(([label, Icon]) => (
            <button
              key={label}
              className={category === label ? "active" : ""}
              onClick={() => {
                choose(label === "More" ? "Others" : label);
                document
                  .getElementById("school-products")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Icon size={23} />
              {label}
              {label === "More" && <ArrowRight size={14} />}
            </button>
          ))}
        </nav>
      </section>
      <main className="sc-main" id="school-products">
        <aside className="sc-filters">
          <section>
            {heading("Category")}
            {!closed.includes("Category") &&
              groups.map((name) => (
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
            {heading("Brand")}
            {!closed.includes("Brand") &&
              brands.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(name)}
                    onChange={() => toggle(setBrands, selectedBrands, name)}
                  />
                  {name}
                </label>
              ))}
          </section>
          <section>
            {heading("Colour")}
            {!closed.includes("Colour") && (
              <div className="sc-colours">
                {colours.map(([name, color]) => (
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
            {heading("Paper Type")}
            {!closed.includes("Paper Type") &&
              ["Ruled", "Grid", "Dot", "Plain"].map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={paper.includes(name)}
                    onChange={() => toggle(setPaper, paper, name)}
                  />
                  {name}
                </label>
              ))}
          </section>
          {(category !== "All" ||
            selectedBrands.length > 0 ||
            prices.length > 0 ||
            colour ||
            paper.length > 0 ||
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
                ? `Showing ${(current - 1) * 16 + 1}–${Math.min(current * 16, list.length)} of ${list.length} products`
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
            <p role="status">Loading school essentials…</p>
          ) : catalogStatus === "error" ? (
            <div className="sc-empty">
              <h2>We couldn’t load the school collection.</h2>
              <button onClick={refreshProducts}>Try again</button>
            </div>
          ) : (
            <>
              <div className="sc-grid">
                {list.slice((current - 1) * 16, current * 16).map((p) => (
                  <article className="sc-card" key={p.id}>
                    <div className="sc-picture">
                      <Link to={"/product/" + p.slug} aria-label={p.name}>
                        <SchoolArt product={p} />
                      </Link>
                      <button
                        aria-label={"Save " + p.name}
                        aria-pressed={wishlist.includes(p.id)}
                        onClick={() => toggleWishlist(p.id)}
                      >
                        <Heart
                          size={19}
                          fill={
                            wishlist.includes(p.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                    </div>
                    <div className="sc-card-copy">
                      <Link to={"/product/" + p.slug}>{p.name}</Link>
                      <p>
                        {p.id === "1"
                          ? "A5 - Ruled"
                          : p.id === "2"
                            ? "Black"
                            : p.variants?.Size?.[0]?.replace("Â·", "·")}
                      </p>
                      <strong>{money(p.salePrice ?? p.price)}</strong>
                      <div className="sc-rating">
                        <span aria-label={`${p.rating} out of 5 stars`}>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                              size={12}
                              key={i}
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
                        <ShoppingCart size={22} />
                        <i />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {!list.length && (
                <div className="sc-empty">
                  <h2>No matching school essentials</h2>
                  <p>Try another filter to find your next bright idea.</p>
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
      <section className="sc-news-banner">
        <div>
          <h2>
            Good things,
            <br />
            in your inbox<span>.</span>
          </h2>
          <p>
            New arrivals, special offers
            <br />
            and creative ideas.
          </p>
        </div>
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
            aria-label="School newsletter email"
            placeholder="Your email address"
          />
          <button aria-label="Join school newsletter">
            <ArrowRight size={21} />
          </button>
        </form>
      </section>
      <ReferenceFooter />
    </div>
  );
}
