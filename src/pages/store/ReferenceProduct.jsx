import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money, slugify } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import "../../reference-product.css";
const colourMap = {
  Natural: "#eee2d2",
  Navy: "#183951",
  Sage: "#7b8150",
  Standard: "#71949b",
  Black: "#22272b",
  Blue: "#60c7e6",
  Pink: "#ff91b1",
  Lavender: "#ddc1f8",
};
const productTile = (p) =>
  /highlighter/i.test(p.name)
    ? 2
    : /pencil case/i.test(p.name)
      ? 11
      : /organis|organ iz/i.test(p.name)
        ? 4
        : /pen/i.test(p.name) && p.category === "Pens"
          ? 1
          : /colour|watercolour/i.test(p.name)
            ? 3
            : /journal/i.test(p.name)
              ? 9
              : 0;
export function ProductArt({ product, view = 0, className = "" }) {
  const notebook = product.id === "1";
  const tile = notebook ? ([0, 1, 2, 5, 4][view] ?? 0) : productTile(product);
  const local = (product.images?.[0]?.startsWith("/") || /^(pettah|promate)-/.test(product.id)) && !notebook;
  if (local)
    return (
      <img
        className={"rp-art " + className}
        src={product.images[Math.min(view, product.images.length - 1)]}
        alt={product.name}
      />
    );
  return (
    <div
      className={"rp-art " + className}
      role="img"
      aria-label={`${product.name}, view ${view + 1}`}
      style={{
        backgroundImage: `url('${notebook ? "/images/product-notebook-gallery.png" : "/images/notebooks-products.png"}')`,
        backgroundSize: notebook ? "300% 200%" : "600% 200%",
        backgroundPosition: notebook
          ? `${(tile % 3) * 50}% ${tile >= 3 ? 100 : 0}%`
          : `${(tile % 6) * 20}% ${tile >= 6 ? 100 : 0}%`,
      }}
    />
  );
}
export default function ReferenceProduct({ slug }) {
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const p = products.find(
    (item) =>
      item.slug === slug && !["Draft", "Archived"].includes(item.status),
  );
  const [view, setView] = useState(0),
    [quantity, setQuantity] = useState(1),
    [tab, setTab] = useState("Description"),
    [zoom, setZoom] = useState(false),
    [variant, setVariant] = useState(() =>
      Object.fromEntries(
        Object.entries(p?.variants || {}).map(([key, values]) => [
          key,
          values[0],
        ]),
      ),
    );
  const selectedVariant = {
    ...Object.fromEntries(
      Object.entries(p?.variants || {}).map(([key, values]) => [
        key,
        values[0],
      ]),
    ),
    ...variant,
  };
  const related = products
    .filter(
      (item) =>
        item.id !== p?.id && !["Archived", "Draft"].includes(item.status),
    )
    .sort(
      (a, b) =>
        (["2", "3", "4", "school-8"].includes(a.id)
          ? ["2", "3", "4", "school-8"].indexOf(a.id)
          : 99) -
        (["2", "3", "4", "school-8"].includes(b.id)
          ? ["2", "3", "4", "school-8"].indexOf(b.id)
          : 99),
    )
    .slice(0, 4);
  const gallery =
    p?.id === "1" ? 5 : Math.max(1, Math.min(p?.images?.length || 1, 5));
  return (
    <div className="reference-shop reference-product">
      <ReferenceHeader home />
      <section className="rp-banner" aria-label="A brighter day on paper">
        <div>
          Details
          <br />
          Make
          <br />
          Brighter
          <br />
          Days. <span>♥</span>
        </div>
        <div>
          Good
          <br />
          People.
          <br />
          Good
          <br />
          Ideas. :)
        </div>
      </section>
      {!p ? (
        <main className="rp-missing">
          {catalogStatus === "loading" ? (
            <p role="status">Loading product…</p>
          ) : catalogStatus === "error" ? (
            <>
              <h1>We couldn’t load this product.</h1>
              <button onClick={refreshProducts}>Try again</button>
            </>
          ) : (
            <>
              <h1>Product not found</h1>
              <Link to="/shop">
                Back to shop <ArrowRight size={18} />
              </Link>
            </>
          )}
        </main>
      ) : (
        <main className="rp-main">
          <nav className="rp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight />
            <Link to="/shop">Shop</Link>
            <ChevronRight />
            <Link to={"/category/" + slugify(p.category)}>{p.category}</Link>
            <ChevronRight />
            <span>{p.name}</span>
          </nav>
          <div className="rp-detail">
            <div className="rp-gallery">
              <div className="rp-thumbnails">
                {Array.from({ length: gallery }, (_, i) => (
                  <button
                    key={i}
                    className={view === i ? "selected" : ""}
                    aria-label={`View product image ${i + 1}`}
                    aria-pressed={view === i}
                    onClick={() => setView(i)}
                  >
                    <ProductArt product={p} view={i} />
                  </button>
                ))}
              </div>
              <div className="rp-gallery-main">
                <div className="rp-large">
                  <ProductArt product={p} view={view} />
                  <button
                    className="rp-zoom"
                    aria-label="Zoom product image"
                    onClick={() => setZoom(true)}
                  >
                    <Search size={21} />
                  </button>
                </div>
                <div className="rp-bottom-thumbnails">
                  {Array.from({ length: Math.min(gallery, 4) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setView(i)}
                      aria-label={`Show gallery view ${i + 1}`}
                      aria-pressed={view === i}
                    >
                      <ProductArt product={p} view={i} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="rp-info">
              <h1>{p.name}</h1>
              <div className="rp-reviews">
                <span aria-label={`${p.rating} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={22}
                      fill={i < Math.round(p.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </span>
                <button
                  onClick={() => {
                    setTab("Reviews");
                    document
                      .getElementById("rp-tabs")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  {p.rating.toFixed(1)} ({p.reviewCount} reviews)
                </button>
              </div>
              <div className="rp-price">
                {money(p.salePrice ?? p.price)}
                {p.salePrice && <del>{money(p.price)}</del>}
              </div>
              <p className="rp-description">
                {p.id === "1"
                  ? "High-quality notebook with smooth paper, perfect for school, office or personal use."
                  : p.description}
              </p>
              <ul className="rp-features">
                {[
                  p.variants?.Size?.[0] && `Size: ${p.variants.Size[0]}`,
                  p.variants?.["Paper Type"]?.[0] &&
                    `${p.variants["Paper Type"][0]} pages`,
                  p.brand && `Brand: ${p.brand}`,
                  p.stock
                    ? "Ready for your next idea"
                    : "Currently out of stock",
                ]
                  .filter(Boolean)
                  .map((text) => (
                    <li key={text}>
                      <Check size={20} />
                      {text}
                    </li>
                  ))}
              </ul>
              {Object.entries(p.variants || {})
                .filter(([key]) => key === "Colour")
                .map(([key, values]) => (
                  <fieldset className="rp-colours" key={key}>
                    <legend>
                      {key}: <span>{selectedVariant[key]}</span>
                    </legend>
                    <div>
                      {values.map((value) => (
                        <button
                          key={value}
                          style={{
                            backgroundColor: colourMap[value] || "#d7c2ae",
                          }}
                          aria-label={`Colour: ${value}`}
                          aria-pressed={selectedVariant[key] === value}
                          title={value}
                          onClick={() =>
                            setVariant({ ...variant, [key]: value })
                          }
                        />
                      ))}
                    </div>
                  </fieldset>
                ))}
              {Object.entries(p.variants || {})
                .filter(([key]) => key !== "Colour")
                .map(([key, values]) => (
                  <label className="rp-option" key={key}>
                    {key}
                    <select
                      aria-label={key}
                      value={selectedVariant[key]}
                      onChange={(e) =>
                        setVariant({ ...variant, [key]: e.target.value })
                      }
                    >
                      {values.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </label>
                ))}
              <div className="rp-buy">
                <div className="rp-quantity">
                  <button
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <Minus size={20} />
                  </button>
                  <output aria-label="Quantity">{quantity}</output>
                  <button
                    aria-label="Increase quantity"
                    disabled={quantity >= p.stock}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button
                  className="rp-cart"
                  disabled={!p.stock}
                  onClick={() => addToCart(p, quantity, selectedVariant)}
                >
                  {p.stock ? "ADD TO CART" : "OUT OF STOCK"}{" "}
                  <ArrowRight size={22} />
                </button>
              </div>
              <div className="rp-perks">
                {[
                  [Truck, "Free Delivery"],
                  [RotateCcw, "Easy Returns"],
                  [CreditCard, "Secure Payment"],
                ].map(([Icon, label]) => (
                  <div key={label}>
                    <Icon size={29} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <p className="rp-delivery-note">
                Free delivery on orders over Rs. 5,000.
              </p>
            </div>
          </div>
          <section className="rp-tabs" id="rp-tabs">
            <div
              className="rp-tab-buttons"
              role="tablist"
              aria-label="Product information"
            >
              {["Description", "Specifications", "Reviews"].map((name) => (
                <button
                  id={"rp-tab-" + name}
                  role="tab"
                  aria-selected={tab === name}
                  aria-controls="rp-tab-content"
                  className={tab === name ? "selected" : ""}
                  key={name}
                  onClick={() => setTab(name)}
                >
                  {name}
                  {name === "Reviews" && ` (${p.reviewCount})`}
                </button>
              ))}
            </div>
            <div
              id="rp-tab-content"
              role="tabpanel"
              aria-labelledby={"rp-tab-" + tab}
            >
              {tab === "Description" ? (
                <p>
                  {p.id === "1"
                    ? "Kokuyo Campus notebooks are loved for their smooth writing experience, durable cover and clean design. Ideal for students, professionals and creatives."
                    : p.description}
                </p>
              ) : tab === "Specifications" ? (
                <dl>
                  {[
                    ["Brand", p.brand],
                    ["SKU", p.SKU],
                    ["Category", p.category],
                    ...Object.entries(p.variants || {}).map(([key, values]) => [
                      key,
                      values.join(", "),
                    ]),
                  ].map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p>
                  {p.reviewCount
                    ? `${p.rating} out of 5 based on ${p.reviewCount} ratings. Written reviews are not available yet.`
                    : "No reviews yet."}
                </p>
              )}
            </div>
            <div className="rp-tab-art" aria-hidden="true">
              <span>
                Small
                <br />
                Things.
                <br />
                Big
                <br />
                Ideas.<i>♥</i>
              </span>
            </div>
          </section>
          <section className="rp-related">
            <h2>
              You may also like <span>.</span>
            </h2>
            <div>
              {related.map((item) => (
                <article className="rp-related-card" key={item.id}>
                  <div className="rp-related-image">
                    <Link to={"/product/" + item.slug}>
                      <ProductArt product={item} />
                    </Link>
                    <button
                      aria-label={"Save " + item.name}
                      aria-pressed={wishlist.includes(item.id)}
                      onClick={() => toggleWishlist(item.id)}
                    >
                      <Heart
                        size={21}
                        fill={
                          wishlist.includes(item.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>
                  <div className="rp-related-copy">
                    <Link to={"/product/" + item.slug}>{item.name}</Link>
                    <p>{item.variants?.Colour?.[0]}</p>
                    <strong>{money(item.salePrice ?? item.price)}</strong>
                    <div className="rp-related-rating">
                      <span>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={
                              i < Math.round(item.rating)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </span>
                      <small>({item.reviewCount})</small>
                    </div>
                    <button
                      aria-label={"Add " + item.name + " to bag"}
                      disabled={!item.stock}
                      onClick={() => addToCart(item)}
                    >
                      <ShoppingBag size={25} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}
      <ReferenceFooter />
      {zoom && p && (
        <div
          className="rp-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
          onClick={() => setZoom(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setZoom(false);
          }}
        >
          <button
            autoFocus
            aria-label="Close image preview"
            onClick={() => setZoom(false)}
          >
            <X />
          </button>
          <div>
            <ProductArt product={p} view={view} />
          </div>
        </div>
      )}
    </div>
  );
}
