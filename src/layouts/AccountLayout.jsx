import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  Bell,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
export default function AccountLayout() {
  const { profile } = useShop(),
    navigate = useNavigate();
  return (
    <div className="container page">
      <span className="eyebrow">YOUR LITTLE CORNER OF PAPERIST</span>
      <h1>
        My account<span className="red-dot">.</span>
      </h1>
      <div className="account-layout">
        <aside className="account-sidebar panel">
          <div className="avatar">{profile.name.charAt(0)}</div>
          <h3>{profile.name}</h3>
          <p className="muted">A collector of good ideas.</p>
          {[
            ["Overview", "", LayoutDashboard],
            ["My orders", "/orders", Package],
            ["Wishlist", "/wishlist", Heart],
            ["Addresses", "/addresses", MapPin],
            ["Profile", "/profile", User],
            ["Password", "/password", Lock],
            ["Notifications", "/notifications", Bell],
          ].map(([label, path, Icon]) => (
            <NavLink end key={label} to={"/account" + path}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              sessionStorage.removeItem("paperist-session");
              navigate("/login");
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </aside>
        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
