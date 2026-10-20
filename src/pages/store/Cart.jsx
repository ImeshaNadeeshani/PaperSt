import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight, Truck } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import {
  Button,
  Breadcrumb,
  EmptyState,
  QuantitySelector,
} from "../../components/common/UI";
export function OrderSummary({ discount = 0, delivery, children }) {
  const { subtotal, cart, products } = useShop();
  const shipping = delivery ?? (subtotal >= 5000 ? 0 : 350);
  return (
    <aside className="summary panel">
      <h3>Order summary</h3>
      {cart.map((item) => {
        const p = products.find((x) => x.id === item.productId);
        return (
          p && (
            <div className="summary-item" key={item.key}>
              <img src={p.images[0]} alt={p.name} />
              <span>
                {p.name}
                <small>Qty {item.quantity}</small>
              </span>
              <strong>{money((p.salePrice ?? p.price) * item.quantity)}</strong>
            </div>
          )
        );
      })}
      <div className="summary-line">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className="summary-line">
        <span>Discount</span>
        <span>− {money(discount)}</span>
      </div>
      <div className="summary-line">
        <span>Delivery</span>
        <span>{shipping ? money(shipping) : "On us"}</span>
      </div>
      <div className="summary-line total">
        <strong>Total</strong>
        <strong>{money(subtotal - discount + shipping)}</strong>
      </div>
      {children}
      <p className="muted">All prices in LKR. This is a frontend demo.</p>
    </aside>
  );
}
export function Wishlist() {
  const { products, wishlist } = useShop();
  return (
    <div className="container page shopping-wishlist">
      <Breadcrumb name="Wishlist" />
      <h1>
        Your little favourites<span className="red-dot">.</span>
      </h1>
      <p>Keep the things that inspire you close.</p>
      <WishlistGrid
        products={products.filter((p) => wishlist.includes(p.id))}
      />
    </div>
  );
}
import { ProductGrid } from "../../components/product/ProductCard";
function WishlistGrid({ products }) {
  return products.length ? (
    <ProductGrid products={products} />
  ) : (
    <EmptyState title="A fresh page for your favourites" />
  );
}
export default function Cart() {
  const { cart, setCart, products, subtotal, notify } = useShop();
  const [code, setCode] = useState(""),
    [discountRate, setDiscountRate] = useState(() =>
      Number(sessionStorage.getItem("paperist-discount") || 0),
    );
  const discount = subtotal * discountRate;
  if (!cart.length)
    return (
      <div className="container page">
        <h1>
          Your bag<span className="red-dot">.</span>
        </h1>
        <EmptyState title="Your bag is waiting for a good idea" />
      </div>
    );
  return (
    <div className="container page shopping-cart">
      <Breadcrumb name="Your bag" />
      <h1>
        Your bag<span className="red-dot">.</span>
      </h1>
      <div className="cart-layout">
        <div>
          <div className="delivery-progress">
            <Truck size={20} />
            <span>
              {subtotal >= 5000
                ? "Lovely! Your delivery is on us."
                : `You’re ${money(5000 - subtotal)} away from free delivery.`}
              <progress value={Math.min(subtotal, 5000)} max="5000" />
            </span>
          </div>
          {cart.map((item) => {
            const p = products.find((x) => x.id === item.productId);
            return (
              p && (
                <article className="cart-item" key={item.key}>
                  <Link to={`/product/${p.slug}`}>
                    <img src={p.images[0]} alt={p.name} />
                  </Link>
                  <div>
                    <span className="eyebrow">{p.brand}</span>
                    <Link to={`/product/${p.slug}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p className="muted">
                      {Object.values(item.variant).join(" / ") ||
                        "Standard edition"}
                    </p>
                    <strong>{money(p.salePrice ?? p.price)}</strong>
                    <QuantitySelector
                      value={item.quantity}
                      max={p.stock}
                      onChange={(quantity) =>
                        setCart((old) =>
                          old.map((x) =>
                            x.key === item.key ? { ...x, quantity } : x,
                          ),
                        )
                      }
                    />
                  </div>
                  <div>
                    <strong>
                      {money((p.salePrice ?? p.price) * item.quantity)}
                    </strong>
                    <button
                      className="icon-button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() =>
                        setCart((old) => old.filter((x) => x.key !== item.key))
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              )
            );
          })}
          <Link className="text-link" to="/shop">
            ← Continue shopping
          </Link>
        </div>
        <OrderSummary discount={discount}>
          <form
            className="promo-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.toUpperCase() === "PAPER10") {
                setDiscountRate(0.1);
                sessionStorage.setItem("paperist-discount", "0.1");
                notify("10% off applied");
              } else {
                setDiscountRate(0);
                sessionStorage.removeItem("paperist-discount");
                notify("Try the demo code PAPER10");
              }
            }}
          >
            <input
              aria-label="Promo code"
              placeholder="Promo code (try PAPER10)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button>Apply</button>
          </form>
          <Button to="/checkout">
            Checkout <ArrowRight size={17} />
          </Button>
          <Link className="summary-continue" to="/shop">
            Continue shopping
          </Link>
          <div className="summary-delivery">
            <Truck size={22} /> Free delivery over Rs. 5,000
          </div>
          <div
            className="summary-art"
            role="img"
            aria-label="Almost there! Illustration of a girl and cat at a stationery desk"
          />
        </OrderSummary>
      </div>
      <div className="bag-art-note">
        <div>
          <span className="eyebrow">ALMOST THERE</span>
          <h2>
            Good ideas are in the bag<span className="red-dot">.</span>
          </h2>
          <p>A few small things. A whole lot of possibility.</p>
        </div>
      </div>
    </div>
  );
}
