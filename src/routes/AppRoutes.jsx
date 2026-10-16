import { Routes, Route } from "react-router-dom";
import StoreLayout from "../layouts/StoreLayout";
import AccountLayout from "../layouts/AccountLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/store/Home";
import Catalog from "../pages/store/Catalog";
import ProductDetails from "../pages/store/ProductDetails";
import Cart, { Wishlist } from "../pages/store/Cart";
import Information, { Corporate } from "../pages/store/Information";
import Checkout, { OrderSuccess, TrackOrder } from "../pages/checkout/Checkout";
import Auth from "../pages/account/Auth";
import {
  AccountOverview,
  MyOrders,
  OrderDetails,
  Addresses,
  Profile,
  Password,
  Notifications,
} from "../pages/account/AccountPages";
import Dashboard from "../pages/admin/Dashboard";
import { AdminProducts, ProductForm } from "../pages/admin/Products";
import {
  Inventory,
  AdminOrders,
  Customers,
  CustomerDetails,
  RFQs,
  RFQDetails,
} from "../pages/admin/Operations";
import Management, { Reviews } from "../pages/admin/Management";
import Content from "../pages/admin/Content";
import Settings from "../pages/admin/Settings";
import Reports from "../pages/admin/Reports";
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        {[
          "shop",
          "category/:slug",
          "back-to-school",
          "search",
          "new-arrivals",
          "best-sellers",
          "sale",
          "gifts",
        ].map((path) => (
          <Route path={path} key={path} element={<Catalog />} />
        ))}
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="track-order" element={<TrackOrder />} />
        {["login", "register", "forgot-password"].map((path) => (
          <Route key={path} path={path} element={<Auth />} />
        ))}
        {[
          "about",
          "contact",
          "faq",
          "delivery",
          "returns",
          "privacy",
          "terms",
          "brands",
          "blog",
        ].map((path) => (
          <Route key={path} path={path} element={<Information />} />
        ))}
        <Route path="corporate" element={<Corporate />} />
        <Route path="account" element={<AccountLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<Password />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Information />} />
      </Route>
      <Route
        path="admin/login"
        element={
          <main>
            <Auth />
          </main>
        }
      />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        {["categories", "brands", "coupons", "banners", "users"].map((path) => (
          <Route key={path} path={path} element={<Management key={path} />} />
        ))}
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<OrderDetails admin />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="corporate-orders" element={<RFQs />} />
        <Route path="corporate-orders/:id" element={<RFQDetails />} />
        <Route path="content" element={<Content />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Information />} />
      </Route>
    </Routes>
  );
}
