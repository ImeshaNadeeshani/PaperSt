import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Gift,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "./ReferenceShop";
import "../../reference-home.css";
const collections = [
  { name: "BACK 2 SCHOOL", note: "Everything they need for a brighter year.", to: "/category/school", image: "/images/category-school-simple.png" },
  { name: "OFFICE", note: "Work smart. Create more.", to: "/category/office", image: "/images/category-office-simple.png" },
  { name: "BOOKS", note: "A fresh page for every new idea.", to: "/category/books", image: "/images/category-books-simple.png" },
  { name: "ARTS & CRAFTS", note: "Make room for colour and creativity.", to: "/category/art", image: "/images/category-art-simple.png" },
  { name: "BITS & BOBS", note: "Little essentials. Endless possibilities.", to: "/category/accessories", image: "/images/category-bits-simple.png" },
  { name: "PAPERS", note: "The start of something wonderful.", to: "/category/paper", image: "/images/category-papers-simple.png" },
];
const needs = [
  ["WRITE", "Pens · Pencils · Markers", 1, "/category/pens"],
  ["PLAN", "Notebooks · Journals · Planners", 0, "/category/notebooks"],
  ["CREATE", "Art · Craft · Colour", 3, "/category/art"],
  ["ORGANISE", "Files · Folders · Desk", 4, "/category/office"],
  ["STUDY", "School · University · Learning", 5, "/category/school"],
  ["GIFT", "Sets · Cards · Wrapping", 6, "/gifts"],
];
export default function ReferenceHome() {
  const { products, wishlist, toggleWishlist, addToCart } = useShop();
  const picks = ["2", "1", "3", "4", "5"]
    .map((id) =>
      products.find(
        (p) => p.id === id && !["Archived", "Draft"].includes(p.status),
      ),
    )
    .filter(Boolean);
  return (
    <div className="reference-shop reference-home">
      <ReferenceHeader home />
      <main>
        <section className="rh-hero">
          <div className="rh-hero-copy">
            <h1>
              Good
              <br />
              Ideas
              <br />
              Start
              <br />
              Here<span>.</span>
            </h1>
            <p>
              Stationery for
              <br />
              ideas worth keeping.
            </p>
            <Link className="rh-button rh-red" to="/shop">
              SHOP NOW <ArrowRight size={17} />
            </Link>
          </div>
          <div className="rh-note">
            Write.
            <br />
            Plan.
            <br />
            Create.
            <br />
            Organise.
            <br />
            Repeat. <span>♥</span>
          </div>
        </section>
        <div className="rh-trust">
          {[
            [Truck, "Islandwide Delivery"],
            [Gift, "Free delivery over Rs. 5,000"],
            [CreditCard, "Secure Payments"],
            [ShieldCheck, "Easy Returns"],
            [MessageCircle, "WhatsApp Support"],
          ].map(([Icon, text]) => (
            <div key={text}>
              <Icon size={25} />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <section className="rh-collections" aria-label="Shop collections">
          {collections.map((c) => (
            <article key={c.name}>
              <Link
                to={c.to}
                className="rh-collection-art"
              >
                <div>
                  <h2>
                    {c.name}
                    <span>.</span>
                  </h2>
                </div>
              </Link>
              <Link to={c.to} className="rh-category-image" aria-label={`Shop ${c.name}`} style={{backgroundImage: `url(${c.image})`}} />
              <div className="rh-collection-details">
                <p>{c.note}</p>
                <Link to={c.to} className="rh-button">
                  SHOP {c.name} <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section className="rh-needs rh-section">
          <h2>
            Shop by what you need<span>.</span>
          </h2>
          <div className="rh-needs-grid">
            {needs.map(([name, note, tile, to]) => (
              <Link to={to} key={name}>
                <div
                  className="rh-need-art"
                  style={{
                    backgroundPosition: `${((tile % 4) * 100) / 3}% ${tile >= 4 ? 100 : 0}%`,
                  }}
                  role="img"
                  aria-label={note}
                />
                <h3>
                  {name}
                  <span>.</span>
                </h3>
                <p>{note}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="rh-best rh-section">
          <div className="rh-section-heading">
            <h2>
              Bestsellers<span>.</span>
            </h2>
            <Link to="/best-sellers">
              See all bestsellers <ArrowRight size={17} />
            </Link>
          </div>
          <div className="rh-products">
            {picks.map((p, i) => {
              const tile = [1, 0, 2, 4, 11][i];
              return (
                <article key={p.id} className="rh-product">
                  <div className="rh-product-image">
                    <Link to={"/product/" + p.slug} aria-label={p.name}>
                      <div
                        role="img"
                        aria-label={p.name}
                        style={{
                          backgroundPosition: `${(tile % 6) * 20}% ${tile >= 6 ? 100 : 0}%`,
                        }}
                      />
                    </Link>
                    <button
                      aria-label={"Save " + p.name}
                      aria-pressed={wishlist.includes(p.id)}
                      onClick={() => toggleWishlist(p.id)}
                    >
                      <Heart
                        size={19}
                        fill={wishlist.includes(p.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="rh-product-info">
                    <Link to={"/product/" + p.slug}>{p.name}</Link>
                    <p>
                      {
                        [
                          "Black",
                          "A5 - Ruled",
                          "Set of 4",
                          "Off White",
                          "Various Colours",
                        ][i]
                      }
                    </p>
                    <strong>{money(p.salePrice ?? p.price)}</strong>
                    <div className="rh-stars">
                      <span>
                        {[0, 1, 2, 3, 4].map((n) => (
                          <Star key={n} size={12} fill="currentColor" />
                        ))}
                      </span>
                      <small>({p.reviewCount})</small>
                    </div>
                    <button
                      aria-label={"Add " + p.name + " to bag"}
                      disabled={!p.stock}
                      onClick={() => addToCart(p)}
                    >
                      <ShoppingBag size={24} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section className="rh-promo">
          <div className="rh-promo-character" />
          <div className="rh-promo-copy">
            <h2>
              Small
              <br />
              Things<span>.</span>
              <br />
              Big Ideas<span>.</span>
            </h2>
            <h3>SHOP UNDER</h3>
            <div>
              {[500, 1000, 2500].map((amount) => (
                <Link to={"/shop?max=" + amount} key={amount}>
                  {money(amount)}
                </Link>
              ))}
              <Link to="/shop" aria-label="Shop all">
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="rh-promo-desk" />
        </section>
      </main>
      <ReferenceFooter />
    </div>
  );
}
