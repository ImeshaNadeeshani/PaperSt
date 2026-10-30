import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  CreditCard,
  Gift,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import { ProductArt } from "./ReferenceProduct";
import "../../reference-cart.css";
function CartArt({ product }) {
  const tile = { 2: 2, 3: 1, 4: 3, 9: 5, "school-8": 12 }[product.id];
  if (tile === undefined) return <ProductArt product={product} />;
  return (
    <div
      className="rp-art"
      role="img"
      aria-label={product.name}
      style={{
        backgroundImage: "url('/images/school-product-grid.png')",
        backgroundSize: "400% 400%",
        backgroundPosition:
          ((tile % 4) * 100) / 3 +
          "% " +
          (Math.floor(tile / 4) * 100) / 3 +
          "%",
      }}
    />
  );
}
export default function ReferenceCart() {
  const {
    cart,
    setCart,
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    notify,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const [code, setCode] = useState(""),
    [discountRate, setDiscountRate] = useState(() =>
      Number(sessionStorage.getItem("paperist-discount") || 0),
    );
  const items = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);
  const subtotal = items.reduce(
      (sum, item) =>
        sum + (item.product.salePrice ?? item.product.price) * item.quantity,
      0,
    ),
    discount = subtotal * discountRate,
    delivery = items.length && subtotal < 5000 ? 350 : 0,
    total = subtotal - discount + delivery;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const recommendations = ["2", "1", "9", "3", "school-8"]
    .map((id) =>
      products.find(
        (p) => p.id === id && !["Archived", "Draft"].includes(p.status),
      ),
    )
    .filter(Boolean);
  const changeQuantity = (item, quantity) =>
    setCart((old) =>
      old.map((x) =>
        x.key === item.key
          ? {
              ...x,
              quantity: Math.max(1, Math.min(item.product.stock, quantity)),
            }
          : x,
      ),
    );
  const applyCode = (e) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === "PAPER10") {
      setDiscountRate(0.1);
      sessionStorage.setItem("paperist-discount", "0.1");
      notify("10% off applied");
    } else {
      notify("That code is not valid. Please try again.");
    }
  };
  return (
    <div className="reference-shop reference-cart">
      <ReferenceHeader home active="" />
      <section className="rc-banner">
        <div className="rc-banner-note">
          <h1>
            Your Bag<span>.</span>
          </h1>
          <p>
            Good ideas are
            <br />
            better together. <span>♥</span>
          </p>
        </div>
        <div className="rc-banner-right">
          Stationery
          <br />
          today.
          <br />
          Brighter
          <br />
          tomorrow. <span>♥</span>
        </div>
      </section>
      <main className="rc-main">
        <nav className="rc-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={15} />
          <span>Your Bag</span>
        </nav>
        <div className="rc-layout">
          <section className="rc-bag">
            <div className="rc-heading">
              <h2>Your Bag</h2>
              <span>
                ({count} {count === 1 ? "item" : "items"})
              </span>
            </div>
            {catalogStatus === "loading" ? (
              <p role="status">Loading your bag…</p>
            ) : catalogStatus === "error" ? (
              <div className="rc-empty">
                <h3>We couldn’t load your bag.</h3>
                <button onClick={refreshProducts}>Try again</button>
              </div>
            ) : items.length ? (
              <div className="rc-items">
                {items.map((item) => {
                  const p = item.product;
                  return (
                    <article className="rc-item" key={item.key}>
                      <Link className="rc-item-image" to={"/product/" + p.slug}>
                        <CartArt product={p} />
                      </Link>
                      <div className="rc-item-copy">
                        <Link to={"/product/" + p.slug}>
                          <h3>{p.name}</h3>
                        </Link>
                        <p>
                          {[
                            item.variant?.Size || p.variants?.Size?.[0],
                            item.variant?.["Paper Type"] ||
                              p.variants?.["Paper Type"]?.[0],
                          ]
                            .filter((x) => x && x !== "Standard")
                            .join(" - ") || p.subcategory}
                        </p>
                        {item.variant?.Colour && (
                          <p className="rc-colour">
                            Colour: {item.variant.Colour}
                          </p>
                        )}
                        <div className="rc-edit">
                          <div className="rc-quantity">
                            <button
                              aria-label={"Decrease quantity of " + p.name}
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                changeQuantity(item, item.quantity - 1)
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <output aria-label={"Quantity of " + p.name}>
                              {item.quantity}
                            </output>
                            <button
                              aria-label={"Increase quantity of " + p.name}
                              disabled={item.quantity >= p.stock}
                              onClick={() =>
                                changeQuantity(item, item.quantity + 1)
                              }
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            className="rc-remove"
                            aria-label={"Remove " + p.name}
                            onClick={() => {
                              setCart((old) =>
                                old.filter((x) => x.key !== item.key),
                              );
                              notify("Removed from your bag");
                            }}
                          >
                            <Trash2 size={21} />
                          </button>
                        </div>
                      </div>
                      <strong className="rc-item-price">
                        {money((p.salePrice ?? p.price) * item.quantity)}
                      </strong>
                      <button
                        className="rc-save"
                        aria-label={"Save " + p.name}
                        aria-pressed={wishlist.includes(p.id)}
                        onClick={() => toggleWishlist(p.id)}
                      >
                        <Heart
                          size={21}
                          fill={
                            wishlist.includes(p.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      {!p.stock && (
                        <span className="rc-unavailable">
                          Out of stock. Please remove this item to continue.
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rc-empty">
                <ShoppingBag size={42} />
                <h3>Your bag is waiting for a good idea.</h3>
                <p>
                  Find your next favourite notebook, pen, or everyday essential.
                </p>
                <Link to="/shop">
                  EXPLORE THE SHOP <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </section>
          <aside className="rc-summary">
            <h2>Order Summary</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div>
                  <dt>Discount</dt>
                  <dd>− {money(discount)}</dd>
                </div>
              )}
              <div>
                <dt>Delivery</dt>
                <dd>
                  {delivery
                    ? money(delivery)
                    : items.length
                      ? "Free"
                      : money(0)}
                </dd>
              </div>
              <div className="rc-total">
                <dt>Total</dt>
                <dd>{money(total)}</dd>
              </div>
            </dl>
            {items.length && !items.some((item) => !item.product.stock) ? (
              <Link className="rc-checkout" to="/checkout">
                PROCEED TO CHECKOUT <ArrowRight size={19} />
              </Link>
            ) : (
              <button className="rc-checkout" disabled>
                PROCEED TO CHECKOUT <ArrowRight size={19} />
              </button>
            )}
            <p className="rc-free-delivery">
              <Truck size={29} />
              Free delivery over Rs. 5,000
            </p>
            {items.length > 0 && (
              <details className="rc-promo-code">
                <summary>Have a promo code?</summary>
                <form onSubmit={applyCode}>
                  <input
                    aria-label="Promo code"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button>Apply</button>
                </form>
                {discountRate > 0 && (
                  <button
                    className="rc-remove-discount"
                    onClick={() => {
                      setDiscountRate(0);
                      sessionStorage.removeItem("paperist-discount");
                    }}
                  >
                    Remove discount
                  </button>
                )}
              </details>
            )}
          </aside>
        </div>
        <section className="rc-related">
          <h2>
            You may also like<span>.</span>
          </h2>
          <div className="rc-recommendations">
            {recommendations.map((p) => (
              <article key={p.id} className="rc-product">
                <div className="rc-product-picture">
                  <Link to={"/product/" + p.slug}>
                    <CartArt product={p} />
                  </Link>
                  <button
                    aria-label={"Save recommended " + p.name}
                    aria-pressed={wishlist.includes(p.id)}
                    onClick={() => toggleWishlist(p.id)}
                  >
                    <Heart
                      size={19}
                      fill={wishlist.includes(p.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="rc-product-copy">
                  <Link to={"/product/" + p.slug}>{p.name}</Link>
                  <p>
                    {p.id === "2"
                      ? "Black"
                      : p.id === "1"
                        ? "A5 - Ruled"
                        : p.variants?.Size?.[0]}
                  </p>
                  <strong>{money(p.salePrice ?? p.price)}</strong>
                  <div className="rc-rating">
                    <span aria-label={`${p.rating} out of 5 stars`}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          size={12}
                          fill={
                            i < Math.round(p.rating) ? "currentColor" : "none"
                          }
                          key={i}
                        />
                      ))}
                    </span>
                    <small>({p.reviewCount})</small>
                  </div>
                  <button
                    aria-label={"Add " + p.name + " to bag"}
                    disabled={!p.stock}
                    onClick={() => addToCart(p)}
                  >
                    <ShoppingBag size={23} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <div className="rc-trust">
          {[
            [Truck, "Islandwide Delivery"],
            [Gift, "Free delivery over Rs. 5,000"],
            [CreditCard, "Secure Payments"],
            [Package, "Easy Returns"],
            [MessageCircle, "WhatsApp Support"],
          ].map(([Icon, text]) => (
            <div key={text}>
              <Icon size={27} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </main>
      <ReferenceFooter />
    </div>
  );
}
