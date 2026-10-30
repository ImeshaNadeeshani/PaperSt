import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Boxes,
  ShoppingBag,
  Users,
  Ticket,
  MessageSquare,
  Briefcase,
  PanelTop,
  Image,
  BarChart3,
  UserCog,
  Settings,
  Menu,
  Search,
  Bell,
  ChevronLeft,
  ExternalLink,
  ArrowRight,
  Send,
  Truck,
} from "lucide-react";
import BrandLogo from "../components/common/BrandLogo";
import { Modal } from "../components/common/UI";
import { ReferenceFooter } from "../pages/store/ReferenceShop";
import { useShop } from "../hooks/useShop";
import "../admin-theme.css";
const adminNav = [
  ["Dashboard", "", LayoutDashboard],
  ["Products", "products", Package],
  ["Categories", "categories", Layers],
  ["Brands", "brands", Tag],
  ["Inventory", "inventory", Boxes],
  ["Orders", "orders", ShoppingBag],
  ["Customers", "customers", Users],
  ["Coupons", "coupons", Ticket],
  ["Reviews", "reviews", MessageSquare],
  ["Corporate RFQs", "corporate-orders", Briefcase],
  ["Website content", "content", PanelTop],
  ["Banners", "banners", Image],
  ["Reports", "reports", BarChart3],
  ["Users & roles", "users", UserCog],
  ["Settings", "settings", Settings],
];
const adminArtwork = Object.fromEntries(
  [
    "dashboard",
    "products",
    "categories",
    "brands",
    "inventory",
    "orders",
    "customers",
    "coupons",
    "reviews",
    "corporate-orders",
    "content",
    "banners",
    "reports",
    "users",
    "settings",
  ].map((section) => [section, "admin-banners/" + section + ".png"]),
);
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false),
    [query, setQuery] = useState("");
  const { profile, products, orders, notify } = useShop();
  const navigate = useNavigate(),
    { pathname } = useLocation();
  const section = pathname.split("/")[2] || "dashboard";
  const artwork = adminArtwork[section] || adminArtwork.dashboard;
  const low = products.filter((p) => p.stock < 12).length,
    pending = orders.filter((o) =>
      ["Pending", "Confirmed", "Processing"].includes(o.status),
    ).length;
  return (
    <div
      className="reference-shop admin-theme"
      style={{ "--admin-page-art": `url("/images/${artwork}")` }}
      data-admin-section={section}
    >
      <div className="ad-announcement">
        <span>A little stationery, a lot of possibility.</span>
        <Link to="/delivery">
          <Truck size={12} />
          Free delivery on orders over Rs. 5,000
        </Link>
      </div>
      <header className="ad-header">
        <Link
          to="/admin"
          className="ad-logo"
          aria-label="Paperist admin dashboard"
        >
          <BrandLogo />
        </Link>
        <button
          className="ad-mobile-menu"
          aria-label="Toggle admin menu"
          aria-expanded={mobile}
          onClick={() => setMobile(!mobile)}
        >
          <Menu size={23} />
        </button>
        <nav aria-label="Store navigation">
          {[
            ["Home", "/"],
            ["School", "/category/school"],
            ["Office", "/category/office"],
            ["Stationery", "/shop"],
            ["About Us", "/about"],
            ["Contact Us", "/contact"],
          ].map(([label, to]) => (
            <Link key={label} to={to}>
              {label}
            </Link>
          ))}
        </nav>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/admin/products?q=" + encodeURIComponent(query));
          }}
        >
          <input
            aria-label="Search admin products"
            placeholder="Search products, name or SKU…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button aria-label="Search admin">
            <Search size={17} />
          </button>
        </form>
        <button
          className="ad-bell"
          aria-label="Notifications"
          onClick={() => setNotifications(true)}
        >
          <Bell size={21} />
          {low > 0 && <i />}
        </button>
        <Link className="ad-user" to="/admin/settings">
          <span className="ad-avatar">
            {profile.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "AP"}
          </span>
          <span>
            {profile.name}
            <small>Store Manager</small>
          </span>
        </Link>
      </header>
      <div className={"admin-shell " + (collapsed ? "collapsed" : "")}>
        <aside className={"admin-sidebar " + (mobile ? "open" : "")}>
          <div className="ad-workspace">
            <Link
              className="ad-workspace-logo"
              to="/admin"
              aria-label="Paperist workspace"
            >
              <BrandLogo />
            </Link>
            <small>Store Management</small>
          </div>
          <nav aria-label="Admin navigation">
            {adminNav.map(([label, path, Icon]) => (
              <NavLink
                title={label}
                end={!path}
                key={label}
                to={"/admin" + (path ? "/" + path : "")}
                onClick={() => setMobile(false)}
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="ad-sidebar-art" aria-hidden="true">
            <span>
              Good
              <br />
              Stock
              <br />
              Better
              <br />
              Sales!<i>♥</i>
            </span>
          </div>
          <div className="ad-sidebar-bottom">
            <Link className="store-link" to="/">
              <ExternalLink size={17} />
              <span>View storefront</span>
            </Link>
            <button
              className="collapse-button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                size={17}
                style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
              />
              <span>Collapse sidebar</span>
            </button>
          </div>
        </aside>
        {mobile && (
          <button
            className="admin-shade"
            aria-label="Close admin menu"
            onClick={() => setMobile(false)}
          />
        )}
        <div className="admin-main">
          <main className="admin-page">
            <Outlet />
          </main>
        </div>
      </div>
      <section className="ad-newsletter">
        <div>
          <h2>Good things, in your inbox.</h2>
          <p>New finds, creative inspiration, and a few lovely surprises.</p>
        </div>
        <div className="ad-news-art" aria-hidden="true" />
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
            aria-label="Admin newsletter email"
            placeholder="Your email address"
          />
          <button aria-label="Join admin newsletter">
            <ArrowRight size={20} />
          </button>
        </form>
        <Send size={33} />
      </section>
      <ReferenceFooter />
      {notifications && (
        <Modal
          title="Store notifications"
          onClose={() => setNotifications(false)}
        >
          <p>{low} products need a stock check.</p>
          <p>{pending} orders are awaiting fulfilment.</p>
          <Link to="/admin/inventory" onClick={() => setNotifications(false)}>
            Review inventory <ArrowRight size={15} />
          </Link>
        </Modal>
      )}
    </div>
  );
}
