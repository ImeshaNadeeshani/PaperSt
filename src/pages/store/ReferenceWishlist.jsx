import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  Send,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import { ProductArt } from "./ReferenceProduct";
import "../../reference-wishlist.css";
function WishlistArt({ product }) {
  const tiles = { 3: 1, 9: 5, 2: 2, "school-12": 6, "school-7": 15 };
  const tile = tiles[product.id];
  return tile === undefined ? (
    <ProductArt product={product} />
  ) : (
    <div
      className="rp-art"
      role="img"
      aria-label={product.name}
      style={{
        backgroundImage: "url('/images/school-product-grid.png')",
        backgroundSize: "400% 400%",
        backgroundPosition: `${((tile % 4) * 100) / 3}% ${(Math.floor(tile / 4) * 100) / 3}%`,
      }}
    />
  );
}
export function WishlistContent({ embedded = false }) {
  const {
    products,
    wishlist,
    cart,
    toggleWishlist,
    addToCart,
    notify,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const saved = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p && !["Draft", "Archived"].includes(p.status));
  const unavailable = wishlist.filter((id) => !saved.some((p) => p.id === id));
  const move = (p) => {
    if (!p.stock) return;
    const existing = cart.find((item) => item.key === p.id + "{}");
    if (existing && existing.quantity >= p.stock) {
      notify("Your bag already contains the available stock.");
      return;
    }
    addToCart(p);
    toggleWishlist(p.id);
  };
  return (
    <div className={"wl-content " + (embedded ? "wl-embedded" : "")}>
      {!embedded && (
        <nav className="wl-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Wishlist</span>
        </nav>
      )}
      <div className="wl-heading">
        <h1>
          Your little favourites<span>.</span>
        </h1>
        <p>Keep the things that inspire you close.</p>
        <div className="wl-heading-art" aria-hidden="true">
          <span>
            Ideas
            <br />
            Today.
            <br />
            Brighter
            <br />
            Tomorrow.<i>♥</i>
          </span>
        </div>
      </div>
      {catalogStatus === "loading" ? (
        <p className="wl-loading" role="status">
          Loading your favourites…
        </p>
      ) : catalogStatus === "error" ? (
        <div className="wl-empty">
          <h2>We couldn’t load your favourites.</h2>
          <button onClick={refreshProducts}>Try again</button>
        </div>
      ) : (
        <>
          {unavailable.length > 0 && (
            <div className="wl-unavailable">
              <p>
                {unavailable.length} saved{" "}
                {unavailable.length === 1 ? "item is" : "items are"} no longer
                available.
              </p>
              <button
                onClick={() => unavailable.forEach((id) => toggleWishlist(id))}
              >
                Remove unavailable items
              </button>
            </div>
          )}
          {saved.length ? (
            <div className="wl-grid">
              {saved.map((p) => (
                <article className="wl-card" key={p.id}>
                  <div className="wl-picture">
                    <Link to={"/product/" + p.slug} aria-label={p.name}>
                      <WishlistArt product={p} />
                    </Link>
                    <span className="wl-badge">
                      {p.bestSeller ? "Bestseller" : "Thoughtfully chosen"}
                    </span>
                    <button
                      className="wl-heart"
                      aria-label={"Unsave " + p.name}
                      aria-pressed="true"
                      onClick={() => toggleWishlist(p.id)}
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>
                  <div className="wl-card-copy">
                    <p className="wl-brand">{p.brand}</p>
                    <Link className="wl-product-name" to={"/product/" + p.slug}>
                      {p.name}
                    </Link>
                    <p className="wl-variant">
                      {p.id === "2"
                        ? "Black"
                        : p.id === "3"
                          ? "Set of 4"
                          : [
                              p.variants?.Size?.[0],
                              p.variants?.["Paper Type"]?.[0],
                            ]
                              .filter((value) => value && value !== "Standard")
                              .map((value) => value.replace("Â·", "·"))
                              .join(" - ") || p.subcategory}
                    </p>
                    <div className="wl-rating">
                      <span aria-label={`${p.rating} out of 5 stars`}>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={
                              i < Math.round(p.rating) ? "currentColor" : "none"
                            }
                          />
                        ))}
                      </span>
                      <small>
                        {p.rating.toFixed(1)} ({p.reviewCount})
                      </small>
                    </div>
                    <strong className="wl-price">
                      {money(p.salePrice ?? p.price)}
                    </strong>
                    <div className="wl-card-actions">
                      <button
                        className="wl-move"
                        aria-label={"Move " + p.name + " to cart"}
                        disabled={!p.stock}
                        onClick={() => move(p)}
                      >
                        <ShoppingCart size={19} />
                        {p.stock ? "Move to cart" : "Out of stock"}
                      </button>
                      <button
                        className="wl-remove"
                        aria-label={"Remove " + p.name + " from wishlist"}
                        onClick={() => toggleWishlist(p.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="wl-empty">
              <Heart size={44} strokeWidth={1.4} />
              <h2>A fresh page for your favourites.</h2>
              <p>
                Tap a heart while you browse to keep your favourite things here.
              </p>
              <Link to="/shop">
                Explore the shop <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default function ReferenceWishlist() {
  const { notify } = useShop();
  return (
    <div className="reference-shop reference-wishlist">
      <ReferenceHeader home active="" />
      <section className="wl-banner">
        <div>
          <h1>
            My Wishlist<span>.</span>
          </h1>
          <p>
            Keep the things
            <br />
            that inspire you close.<span>♥</span>
          </p>
        </div>
        <aside>
          Good
          <br />
          Ideas
          <br />
          Always
          <br />
          With You.<span>♥</span>
        </aside>
      </section>
      <main className="wl-main">
        <WishlistContent />
      </main>
      <section className="wl-newsletter">
        <div className="wl-news-art" aria-hidden="true" />
        <div className="wl-news-copy">
          <span>A LITTLE NOTE FROM US</span>
          <h2>
            Good things, in your inbox<span>.</span>
          </h2>
          <p>New finds, creative inspiration, and a few lovely surprises.</p>
        </div>
        <Send className="wl-plane" size={36} strokeWidth={1.5} />
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
            aria-label="Wishlist newsletter email"
            placeholder="Your email address"
          />
          <button aria-label="Join wishlist newsletter">
            <ArrowRight size={21} />
          </button>
        </form>
      </section>
      <ReferenceFooter />
    </div>
  );
}
