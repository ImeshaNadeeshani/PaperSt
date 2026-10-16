import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import {
  Breadcrumb,
  QuantitySelector,
  RatingStars,
  Button,
  SectionHeader,
  EmptyState,
} from "../../components/common/UI";
import { ProductGrid } from "../../components/product/ProductCard";
import useLocalStorage from "../../hooks/useLocalStorage";
export default function ProductDetails() {
  const { slug } = useParams();
  return <ProductView key={slug} slug={slug} />;
}
function ProductView({ slug }) {
  const navigate = useNavigate(),
    { products, addToCart, wishlist, toggleWishlist } = useShop();
  const p = products.find((x) => x.slug === slug);
  const [quantity, setQuantity] = useState(1),
    [image, setImage] = useState(0),
    [variant, setVariant] = useState(() =>
      Object.fromEntries(
        Object.entries(p?.variants || {}).map(([key, values]) => [
          key,
          values[0],
        ]),
      ),
    ),
    [tab, setTab] = useState("Description"),
    [recent, setRecent] = useLocalStorage("paperist-recent", []);
  const productId = p?.id;
  useEffect(() => {
    if (productId)
      setRecent((old) =>
        [productId, ...old.filter((x) => x !== productId)].slice(0, 5),
      );
  }, [productId, setRecent]);
  if (!p) return <EmptyState title="This product could not be found" />;
  return (
    <div className="container page shopping-product">
      <Breadcrumb name={p.name} />
      <div className="product-details">
        <div className="product-gallery">
          <div className="detail-image">
            <img src={p.images[image]} alt={p.name} />
          </div>
          <div className="thumbnails">
            {p.images.map((x, i) => (
              <button
                className={i === image ? "selected" : ""}
                aria-label={`View product image ${i + 1}`}
                onClick={() => setImage(i)}
                key={x}
              >
                <img src={x} alt={`${p.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-info">
          <Link className="eyebrow" to={"/search?q=" + p.brand}>
            {p.brand}
          </Link>
          <h1>
            {p.name}
            <span className="red-dot">.</span>
          </h1>
          <div className="muted">SKU {p.SKU}</div>
          {p.rating > 0 && (
            <RatingStars rating={p.rating} count={p.reviewCount} />
          )}
          <div className="detail-price">
            {money(p.salePrice ?? p.price)}{" "}
            {p.salePrice && <del>{money(p.price)}</del>}
          </div>
          <p>{p.description}</p>
          {p.samplePrice && (
            <p className="school-price-note">
              Illustrated product preview · sample price in LKR.
            </p>
          )}
          <span className={p.stock ? "stock" : "red"}>
            {p.stock ? `● In stock — ${p.stock} available` : "Out of stock"}
          </span>
          {Object.entries(p.variants).map(([key, values]) => (
            <div className="variant" key={key}>
              <strong>
                {key}: {variant[key]}
              </strong>
              <div>
                {values.map((value) => (
                  <button
                    className={variant[key] === value ? "selected" : ""}
                    key={value}
                    onClick={() => setVariant({ ...variant, [key]: value })}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="purchase-row">
            <QuantitySelector
              value={quantity}
              max={p.stock}
              onChange={setQuantity}
            />
            <Button
              disabled={!p.stock}
              onClick={() => addToCart(p, quantity, variant)}
            >
              Add to bag
            </Button>
            <button
              className="icon-button"
              aria-label="Save to wishlist"
              aria-pressed={wishlist.includes(p.id)}
              onClick={() => toggleWishlist(p.id)}
            >
              <Heart fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <Button
            secondary
            disabled={!p.stock}
            onClick={() => {
              addToCart(p, quantity, variant);
              navigate("/checkout");
            }}
          >
            Buy now
          </Button>
          <div className="product-trust">
            <span>
              <Truck size={17} /> Islandwide delivery in 3–5 business days
            </span>
            <span>
              <RotateCcw size={17} /> Easy returns within 14 days
            </span>
            <span>
              <ShieldCheck size={17} /> Payment options shown at checkout (demo)
            </span>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="tabs" role="tablist">
          {["Description", "Specifications", "Delivery", "Reviews"].map((x) => (
            <button
              role="tab"
              aria-selected={tab === x}
              className={tab === x ? "active" : ""}
              onClick={() => setTab(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tab === "Description" ? (
            <>
              <h3>Made for your everyday.</h3>
              <p>
                {p.description} Keep a little space for inspiration, whether
                you’re taking meeting notes, planning tomorrow, or catching an
                idea before it disappears.
              </p>
            </>
          ) : tab === "Specifications" ? (
            <dl className="specs">
              {Object.entries({
                Brand: p.brand,
                SKU: p.SKU,
                Category: p.category,
                ...variant,
              }).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : tab === "Delivery" ? (
            <p>
              Standard delivery: Rs. 350, free for orders over Rs. 5,000.
              Express: Rs. 650. Store pickup is free. Estimated delivery: 3–5
              business days. See our <Link to="/returns">returns policy</Link>.
            </p>
          ) : (
            <>
              <RatingStars rating={p.rating} count={p.reviewCount} />
              <h3>“A lovely addition to my desk.”</h3>
              <p>
                Beautiful quality and thoughtfully packaged. — Amaya, verified
                demo review
              </p>
            </>
          )}
        </div>
      </section>
      {[
        "Frequently bought together",
        "You may also like",
        "Recently viewed",
      ].map((title, i) => (
        <section className="section" key={title}>
          <SectionHeader title={title} />
          <ProductGrid
            products={
              i === 2
                ? products
                    .filter((x) => recent.includes(x.id) && x.id !== p.id)
                    .slice(0, 4)
                : products
                    .filter(
                      (x) =>
                        x.id !== p.id && (i === 0 || x.category === p.category),
                    )
                    .slice(0, 4)
            }
          />
        </section>
      ))}
    </div>
  );
}
