import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  House,
  Lightbulb,
  LockKeyhole,
  LogOut,
  MapPin,
  Package,
  Send,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "../store/ReferenceShop";
import "../../reference-account.css";
const links = [
  ["Overview", "", House],
  ["My orders", "/orders", Package],
  ["Wishlist", "/wishlist", Heart],
  ["Addresses", "/addresses", MapPin],
  ["Profile", "/profile", UserRound],
  ["Password", "/password", LockKeyhole],
  ["Notifications", "/notifications", Bell],
];
export default function ReferenceAccountLayout() {
  const { profile, notify } = useShop(),
    navigate = useNavigate(),
    { pathname } = useLocation();
  const current =
    links.find(([, path]) => "/account" + path === pathname)?.[0] ||
    "Order details";
  return (
    <div className="reference-shop reference-account">
      <div className="ac-announcement">
        <span>
          <Truck size={13} /> A little stationery, a lot of possibility.
        </span>
        <Link to="/delivery">
          <Truck size={13} />
          Free delivery on orders over Rs. 5,000 <ArrowRight size={13} />
        </Link>
      </div>
      <ReferenceHeader home active="" />
      <section className="ac-banner">
        <div>
          <h1>
            My Account<span>.</span>
          </h1>
          <p>
            Good ideas,
            <br />
            always with you. <span>♥</span>
          </p>
        </div>
      </section>
      <main className="ac-main">
        <aside className="ac-sidebar">
          <div className="ac-avatar">
            {profile.name?.trim().charAt(0).toUpperCase() || "A"}
          </div>
          <h2>{profile.name || "Your account"}</h2>
          <p>A collector of good ideas.</p>
          <nav aria-label="Account navigation">
            {links.map(([label, path, Icon]) => (
              <NavLink end key={label} to={"/account" + path}>
                <Icon size={21} />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                sessionStorage.removeItem("paperist-session");
                navigate("/login");
              }}
            >
              <LogOut size={21} />
              Logout
            </button>
          </nav>
          <div className="ac-sidebar-art" aria-hidden="true">
            <span>
              Keep
              <br />
              Creating
              <br />
              Keep
              <br />
              Growing.<i>♥</i>
            </span>
          </div>
        </aside>
        <div className="ac-content">
          <nav className="ac-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={12} />
            <Link to="/account">My Account</Link>
            {current !== "Overview" && (
              <>
                <ChevronRight size={12} />
                <span>{current}</span>
              </>
            )}
          </nav>
          <Outlet />
        </div>
      </main>
      <section className="ac-newsletter">
        <div className="ac-news-art" aria-hidden="true" />
        <div>
          <h2>Good things, in your inbox.</h2>
          <p>New finds, creative inspiration, and a few lovely surprises.</p>
        </div>
        <Send className="ac-paper-plane" size={38} strokeWidth={1.4} />
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
            aria-label="Account newsletter email"
            placeholder="Your email address"
          />
          <button aria-label="Join account newsletter">
            <ArrowRight size={19} />
          </button>
        </form>
      </section>
      <ReferenceFooter />
    </div>
  );
}
export function ReferenceAccountOverview() {
  const { profile, orders, wishlist, addresses } = useShop();
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const own = orders
    .filter(
      (order) => order.email?.toLowerCase() === profile.email?.toLowerCase(),
    )
    .sort((a, b) => b.date.localeCompare(a.date));
  const address = addresses.find((item) => item.default) || addresses[0];
  return (
    <>
      <div className="ac-welcome">
        <h1>
          Hello, {profile.name?.trim().split(/\s+/)[0] || "there"}{" "}
          <span role="img" aria-label="waving hand">
            👋
          </span>
        </h1>
        <p>Here’s what’s happening in your little corner.</p>
        <div className="ac-welcome-note" aria-hidden="true">
          <span>
            Good
            <br />
            Ideas
            <br />
            Always
            <br />
            With You.<i>♥</i>
          </span>
          <Lightbulb size={42} />
        </div>
      </div>
      <section className="ac-stats" aria-label="Account summary">
        {[
          [Package, "Orders", own.length, "View orders", "/account/orders"],
          [
            Heart,
            "Saved favourites",
            wishlist.length,
            "View wishlist",
            "/account/wishlist",
          ],
          [Gift, "Reward points", 240, "How to earn", null],
        ].map(([Icon, label, value, cta, to], i) => (
          <article key={label}>
            <div className={"ac-stat-icon ac-stat-icon-" + i}>
              <Icon size={32} strokeWidth={1.7} />
            </div>
            <div>
              <h2>{label}</h2>
              <strong>{value}</strong>
              {to ? (
                <Link to={to}>
                  {cta}
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <button onClick={() => setRewardsOpen(true)}>
                  {cta}
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
      <section className="ac-recent ac-panel">
        <div className="ac-section-heading">
          <h2>
            <Clock3 size={25} />
            Recent orders
          </h2>
          <Link to="/account/orders">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {own.length ? (
          <div className="ac-table-scroll">
            <table>
              <thead>
                <tr>
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Total",
                    "Payment",
                    "Status",
                    "Action",
                  ].map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {own.slice(0, 3).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={"/account/orders/" + order.id}>
                        #{order.id}
                      </Link>
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{money(order.total)}</td>
                    <td>{order.payment}</td>
                    <td>
                      <span
                        className={
                          "ac-order-status ac-status-" +
                          order.status.toLowerCase()
                        }
                      >
                        {order.status === "Delivered" ? (
                          <CheckCircle2 size={16} />
                        ) : order.status === "Shipped" ? (
                          <Truck size={16} />
                        ) : (
                          <Package size={16} />
                        )}{" "}
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="ac-view-order"
                        to={"/account/orders/" + order.id}
                        aria-label={"View order " + order.id}
                      >
                        View <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ac-no-orders">
            <p>Your next good idea starts with your first order.</p>
            <Link to="/shop">
              Explore the shop <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>
      <section className="ac-default-address ac-panel">
        <MapPin size={29} />
        <div>
          <h2>Your default address</h2>
          <p>{address?.address || "Add an address to get started."}</p>
          <Link to="/account/addresses">
            Manage addresses <ArrowRight size={15} />
          </Link>
        </div>
        <div className="ac-address-art" aria-hidden="true">
          <span>
            Home
            <br />
            for all my
            <br />
            good ideas.<i>♥</i>
          </span>
        </div>
      </section>
      {rewardsOpen && (
        <div
          className="ac-modal-overlay"
          onClick={() => setRewardsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setRewardsOpen(false);
          }}
        >
          <section
            className="ac-rewards-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ac-rewards-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="ac-modal-close"
              aria-label="Close rewards information"
              onClick={() => setRewardsOpen(false)}
            >
              <X size={22} />
            </button>
            <Gift size={40} />
            <h2 id="ac-rewards-title">A little reward for your ideas.</h2>
            <p>
              Your account currently shows 240 demo reward points. Earning and
              redeeming points will be available when the rewards programme
              launches.
            </p>
            <button
              className="ac-modal-done"
              onClick={() => setRewardsOpen(false)}
            >
              Got it
            </button>
          </section>
        </div>
      )}
    </>
  );
}
