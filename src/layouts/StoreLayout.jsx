import { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { useShop } from "../hooks/useShop";
export function TrustBadges() {
  return (
    <div className="trust-bar">
      {[
        [Truck, "Islandwide delivery"],
        [ShoppingBag, "Free delivery over Rs. 5,000"],
        [ShieldCheck, "Secure payments"],
        [RotateCcw, "Easy returns"],
        [MessageCircle, "WhatsApp support"],
      ].map(([Icon, title]) => (
        <span key={title}>
          <Icon size={19} />
          {title}
        </span>
      ))}
    </div>
  );
}
export function Newsletter() {
  const { notify, content } = useShop();
  const config = content.find((x) => x.name === "Newsletter") || {};
  return (
    <section className="newsletter">
      <div>
        <span className="eyebrow">A LITTLE NOTE FROM US</span>
        <h2>{config.title || "Good things, in your inbox."}</h2>
        <p>
          {config.subtitle ||
            "New finds, creative inspiration, and a few lovely surprises."}
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          notify("You’re on the list. Thank you!");
          e.target.reset();
        }}
      >
        <input
          aria-label="Newsletter email"
          type="email"
          placeholder="Your email address"
          required
        />
        <button aria-label="Subscribe">{config.cta || <ArrowRight />}</button>
      </form>
    </section>
  );
}
export default function StoreLayout() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState("");
  const { cart, wishlist, content } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const links = [
    "Shop",
    "School",
    "Office",
    "Art",
    "Journals",
    "Gifts",
    "Brands",
    "Sale",
    "Contact Us",
  ];
  const path = (x) =>
    x === "Contact Us"
      ? "/contact"
      : x === "Shop"
      ? "/shop"
      : ["Brands", "Sale", "Gifts"].includes(x)
        ? "/" + x.toLowerCase()
        : "/category/" + x.toLowerCase();
  return (
    <>
      <div
        className={`announcement ${location.pathname === "/" ? "home-announcement" : ""}`}
      >
        A little stationery. A lot of possibility.{" "}
        <span>Free delivery on orders over Rs. 5,000 ↗</span>
      </div>
      <header
        className={`store-header ${location.pathname === "/" ? "home-header" : ""}`}
      >
        <Link className="logo official-logo" to="/" aria-label="Paperist home">
          <img src="/images/official-logo.jpeg" alt="Paperist" />
        </Link>
        <nav className="desktop-nav">
          {links.map((x) => (
            <div className="nav-item" key={x}>
              <NavLink className={x === "Sale" ? "red" : ""} to={path(x)}>
                {x}
              </NavLink>
              {!["Sale", "Brands", "Contact Us"].includes(x) && (
                <div className="mega-menu">
                  <b>Find your next favourite</b>
                  <Link to="/new-arrivals">Just landed</Link>
                  <Link to="/best-sellers">Everyday favourites</Link>
                  <Link to={path(x)}>Explore {x}</Link>
                  <Link to="/back-to-school">Back to school</Link>
                </div>
              )}
            </div>
          ))}
        </nav>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/search?q=" + encodeURIComponent(search));
          }}
        >
          <Search size={17} />
          <input
            aria-label="Search products"
            placeholder="Find your next good idea…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="header-icons">
          <Link aria-label="Search" className="mobile-search" to="/search">
            <Search size={21} />
          </Link>
          <Link aria-label="Your account" to="/account">
            <User size={21} />
          </Link>
          <Link aria-label="Wishlist" to="/wishlist">
            <Heart size={21} />
            {wishlist.length > 0 && <small>{wishlist.length}</small>}
          </Link>
          <Link aria-label="Shopping bag" to="/cart">
            <ShoppingBag size={21} />
            <small>{cart.reduce((n, x) => n + x.quantity, 0)}</small>
          </Link>
          <button
            className="mobile-toggle icon-button"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav className="mobile-nav" onClick={() => setMenu(false)}>
            {links.map((x) => (
              <Link key={x} to={path(x)}>
                {x}
                <ArrowRight size={16} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      {content.find((x) => x.name === "Newsletter")?.visible !== false && (
        <Newsletter />
      )}
      <footer>
        <div className="footer-top">
          <div>
            <Link className="logo official-logo" to="/" aria-label="Paperist home">
              <img src="/images/official-logo.jpeg" alt="Paperist" />
            </Link>
            <p>
              For the notes, the doodles,
              <br />
              and the ideas that become something.
            </p>
            <span>Made for your everyday. ♡</span>
          </div>
          {[
            [
              "Explore",
              ["Shop", "/shop"],
              ["New arrivals", "/new-arrivals"],
              ["Best sellers", "/best-sellers"],
              ["Our brands", "/brands"],
              ["Corporate orders", "/corporate"],
            ],
            [
              "Here to help",
              ["Contact us", "/contact"],
              ["Delivery & shipping", "/delivery"],
              ["Returns & exchanges", "/returns"],
              ["Track your order", "/track-order"],
              ["FAQs", "/faq"],
            ],
            [
              "A little about us",
              ["Our story", "/about"],
              ["The Paperist journal", "/blog"],
              ["Your account", "/account"],
              ["Get in touch", "/contact"],
              ["Admin demo", "/admin"],
            ],
          ].map(([title, ...items]) => (
            <div key={title}>
              <h4>{title}</h4>
              {items.map(([label, to]) => (
                <Link key={label} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Paperist. A space for good ideas.</span>
          <div>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms & conditions</Link>
            <span>LKR · Sri Lanka</span>
          </div>
        </div>
      </footer>
    </>
  );
}
