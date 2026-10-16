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
} from "lucide-react";
import { Modal } from "../components/common/UI";
const adminNav = [
  ["Overview", "", LayoutDashboard],
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
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false),
    [query, setQuery] = useState("");
  const navigate = useNavigate(),
    { pathname } = useLocation();
  const title =
    adminNav.find(
      ([, path]) => path && pathname.startsWith("/admin/" + path),
    )?.[0] || "Overview";
  return (
    <div className={`admin-shell ${collapsed ? "collapsed" : ""}`}>
      <aside className={`admin-sidebar ${mobile ? "open" : ""}`}>
        <Link className="logo" to="/admin">
          paperist<span>●</span>
        </Link>
        <div className="admin-workspace">
          STORE WORKSPACE <span>DEMO</span>
        </div>
        <nav>
          {adminNav.map(([label, path, Icon]) => (
            <NavLink
              title={label}
              onClick={() => setMobile(false)}
              end={!path}
              key={label}
              to={"/admin" + (path ? "/" + path : "")}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <Link className="store-link" to="/">
          <ExternalLink size={17} />
          <span>View storefront</span>
        </Link>
        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft size={17} />
          <span>Collapse sidebar</span>
        </button>
      </aside>
      {mobile && (
        <div className="admin-shade" onClick={() => setMobile(false)} />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-mobile icon-button"
            aria-label="Toggle admin menu"
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </button>
          <div className="muted">
            Workspace <span>/</span> <strong>{title}</strong>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/admin/products?q=" + encodeURIComponent(query));
            }}
          >
            <Search size={17} />
            <input
              aria-label="Search admin products"
              placeholder="Search your store…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>↵</kbd>
          </form>
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => setNotifications(true)}
          >
            <Bell size={19} />
            <span className="tiny-dot" />
          </button>
          <Link className="admin-user" to="/admin/settings">
            <div className="avatar">AP</div>
            <span>
              Amaya Perera<small>Store manager</small>
            </span>
          </Link>
        </header>
        <main className="admin-page">
          <Outlet />
        </main>
        <div className="admin-footer">
          Paperist workspace <span>Local demo · Sri Lanka · LKR</span>
        </div>
      </div>
      {notifications && (
        <Modal
          title="Store notifications"
          onClose={() => setNotifications(false)}
        >
          <p>3 products need a stock check.</p>
          <p>2 new orders are ready to pack.</p>
          <p>Your homepage content is up to date.</p>
        </Modal>
      )}
    </div>
  );
}
