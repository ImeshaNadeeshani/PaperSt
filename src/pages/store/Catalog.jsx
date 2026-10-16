import { useState } from "react";
import {
  useParams,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { categories, slugify } from "../../data/products";
import { Breadcrumb, EmptyState, Button } from "../../components/common/UI";
import { ProductGrid } from "../../components/product/ProductCard";
export default function Catalog() {
  const { products } = useShop(),
    { slug } = useParams(),
    { pathname } = useLocation(),
    [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false),
    [sort, setSort] = useState("Featured"),
    [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    max: params.get("max") || "",
    colour: "",
    size: "",
    paper: params.get("paper") || "",
    rating: "",
    availability: false,
    subcategory: "",
  });
  const category =
    categories.find((x) => slugify(x) === slug) ||
    (slug === "art" ? "Art Supplies" : slug === "office" ? "Office" : "");
  const title =
    pathname === "/search"
      ? "Find your next good idea"
      : pathname === "/back-to-school"
        ? "Back to school."
        : slug
          ? category || slug.replaceAll("-", " ")
          : {
              "/new-arrivals": "Just landed",
              "/best-sellers": "Everyday favourites",
              "/sale": "A little treat",
              "/gifts": "Gifts that mean more.",
            }[pathname] || "The stationery shop";
  const isSchool = category === "School" || pathname === "/back-to-school";
  const isOffice = category === "Office";
  const isSupplies = isSchool || isOffice;
  const suppliesCategory = isOffice ? "Office" : "School";
  const update = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };
  let list = products.filter(
    (p) => p.status !== "Archived" && p.status !== "Draft",
  );
  if (category)
    list = list.filter(
      (p) =>
        p.category === category ||
        (category === "Office" && p.category === "Desk & Organisers"),
    );
  if (pathname === "/back-to-school")
    list = list.filter((p) =>
      ["School", "Pens", "Books", "Art Supplies"].includes(p.category),
    );
  if (pathname === "/gifts") list = list.filter((p) => p.category === "Gifts");
  if (pathname === "/sale") list = list.filter((p) => p.salePrice);
  if (pathname === "/new-arrivals") list = list.filter((p) => p.newArrival);
  if (pathname === "/best-sellers") list = list.filter((p) => p.bestSeller);
  const q = params.get("q") || "";
  list = list.filter(
    (p) =>
      (p.name + " " + p.category + " " + p.brand)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.subcategory || p.subcategory === filters.subcategory) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.max || (p.salePrice ?? p.price) <= Number(filters.max)) &&
      (!filters.colour || p.variants.Colour.includes(filters.colour)) &&
      (!filters.size || p.variants.Size.includes(filters.size)) &&
      (!filters.paper ||
        p.variants["Paper Type"].includes(filters.paper) ||
        (filters.paper && p.category === "Paper")) &&
      (!filters.rating || p.rating >= Number(filters.rating)) &&
      (!filters.availability || p.stock > 0),
  );
  if (sort === "Price: low to high")
    list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  if (sort === "Price: high to low")
    list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  if (sort === "Newest") list.sort((a, b) => Number(b.id) - Number(a.id));
  if (sort === "Best selling")
    list.sort((a, b) => b.reviewCount - a.reviewCount);
  if (isSupplies && sort === "Featured")
    list.sort(
      (a, b) =>
        Number(b.id.startsWith(isOffice ? "office-" : "school-")) -
        Number(a.id.startsWith(isOffice ? "office-" : "school-")),
    );
  const pageSize = isSupplies ? 24 : 12;
  const filterUI = (
    <>
      <div className="section-header">
        <h3>Refine your finds</h3>
        <button
          className="icon-button filter-close"
          aria-label="Close filters"
          onClick={() => setDrawer(false)}
        >
          <X />
        </button>
      </div>
      {[
        ["category", "Category", categories],
        [
          "subcategory",
          "Subcategory",
          isSupplies
            ? [
                ...new Set(
                  products
                    .filter((p) => p.category === suppliesCategory)
                    .map((p) => p.subcategory),
                ),
              ]
            : ["Everyday essentials"],
        ],
        ["brand", "Brand", [...new Set(products.map((p) => p.brand))]],
        ["colour", "Colour", ["Natural", "Navy", "Sage"]],
        ["size", "Size", ["A5", "A4", "Pocket"]],
        [
          "paper",
          "Paper type",
          [
            "Ruled",
            "Dot",
            "Plain",
            "Kraft",
            "Sketch",
            "Watercolour",
            "Coloured",
          ],
        ],
        ["rating", "Rating", ["4", "4.5", "4.8"]],
      ].map(([key, label, options]) => (
        <label className="filter-group" key={key}>
          <strong>{label}</strong>
          <select
            aria-label={label}
            value={filters[key]}
            onChange={(e) => update(key, e.target.value)}
          >
            <option value="">All {label.toLowerCase()}</option>
            {options.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      ))}
      <label className="filter-group">
        <strong>Maximum price (Rs.)</strong>
        <input
          type="number"
          min="0"
          placeholder="Any price"
          value={filters.max}
          onChange={(e) => update("max", e.target.value)}
        />
      </label>
      <label className="check">
        <input
          type="checkbox"
          checked={filters.availability}
          onChange={(e) => update("availability", e.target.checked)}
        />{" "}
        In stock only
      </label>
      <button
        className="text-link"
        onClick={() => {
          setFilters({
            category: "",
            brand: "",
            max: "",
            colour: "",
            size: "",
            paper: "",
            rating: "",
            availability: false,
            subcategory: "",
          });
          setParams({});
          setPage(1);
        }}
      >
        Clear all filters
      </button>
      <Button onClick={() => setDrawer(false)}>Show {list.length} finds</Button>
    </>
  );
  return (
    <div
      className={`container page shopping-catalog ${isSchool ? "school-catalog" : isOffice ? "office-catalog" : ""}`}
    >
      <Breadcrumb name={title} />
      {slug || pathname === "/back-to-school" || pathname === "/gifts" ? (
        <section
          className={`catalog-banner collection-banner ${pathname === "/back-to-school" || category === "School" ? "collection-school" : category === "Office" ? "collection-office" : "collection-general"}`}
        >
          <div>
            <span className="eyebrow">A LITTLE EVERYDAY INSPIRATION</span>
            <h1>{title}</h1>
            <p>
              {pathname === "/back-to-school"
                ? "Everything they need for a brighter year."
                : "Thoughtful essentials for your next chapter."}
            </p>
          </div>
          <div
            className="collection-art"
            role="img"
            aria-label={`${title} illustrated stationery collection`}
          />
        </section>
      ) : (
        <>
          <span className="eyebrow">FOR EVERY NOTE, DOODLE & DAYDREAM</span>
          <h1>
            {title}
            <span className="red-dot">.</span>
          </h1>
        </>
      )}
      {isSupplies && (
        <p className="school-price-note">
          {isOffice
            ? "Thoughtful tools for a productive workspace."
            : "School essentials for every bright idea."}{" "}
          Prices are sample LKR prices; pack sizes are listed on each product
          page.
        </p>
      )}
      {pathname === "/back-to-school" && (
        <div className="chips">
          {[
            "School Essentials",
            "Pens & Pencils",
            "Pencil Cases",
            "School Bags",
            "Lunch Boxes",
            "Water Bottles",
            "Art Supplies",
            "Geometry Sets",
            "Exercise Books",
          ].map((x) => (
            <Link
              key={x}
              to={"/search?q=" + encodeURIComponent(x.split(" ")[0])}
            >
              {x}
            </Link>
          ))}
        </div>
      )}
      {slug && (
        <div className="chips">
          <button onClick={() => update("subcategory", "Everyday essentials")}>
            Everyday essentials
          </button>
          <Link to="/new-arrivals">New arrivals</Link>
          <Link to="/best-sellers">Best sellers</Link>
        </div>
      )}
      {pathname === "/search" && (
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            setParams({ q: new FormData(e.target).get("q") });
            setPage(1);
          }}
        >
          <input
            name="q"
            aria-label="Search"
            defaultValue={q}
            placeholder="Products, categories, brands…"
          />
          <Button>Search</Button>
        </form>
      )}
      <div className="catalog-toolbar">
        <span>
          {list.length} thoughtfully chosen finds {q && `for “${q}”`}
        </span>
        <button className="filter-trigger" onClick={() => setDrawer(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
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
            "Newest",
            "Best selling",
            "Price: low to high",
            "Price: high to low",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="catalog-layout">
        <aside className="filter-sidebar">{filterUI}</aside>
        <div>
          {list.length ? (
            <ProductGrid
              products={list.slice((page - 1) * pageSize, page * pageSize)}
            />
          ) : (
            <EmptyState
              title="No finds this time"
              text="Try a different search or loosen your filters."
            />
          )}
          {list.length > pageSize && (
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(list.length / pageSize) },
                (_, i) => (
                  <button
                    className={page === i + 1 ? "selected" : ""}
                    onClick={() => setPage(i + 1)}
                    key={i}
                  >
                    {i + 1}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            {filterUI}
          </aside>
        </div>
      )}
    </div>
  );
}
