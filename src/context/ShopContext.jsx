import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { fetchPublishedProducts } from "../services/products";
import { ShopContext as Context } from "./context";
import useLocalStorage from "../hooks/useLocalStorage";
import { products as seed } from "../data/products";
import { migrateSchoolProducts } from "../data/schoolProducts";
import { migrateOfficeProducts } from "../data/officeProducts";
import { orders as orderSeed } from "../data/orders";
import { defaultHomeContent, migrateHomeContent } from "../data/homeContent";

export function ShopProvider({ children }) {
  const [localProducts, setLocalProducts] = useLocalStorage(
      "paperist-products",
      seed,
      (products) => migrateOfficeProducts(migrateSchoolProducts(products)),
    ),
    [orders, setOrders] = useLocalStorage("paperist-orders", orderSeed),
    [cart, setCart] = useLocalStorage("paperist-cart", []),
    [wishlist, setWishlist] = useLocalStorage("paperist-wishlist", []),
    [profile, setProfile] = useLocalStorage("paperist-profile", {
      name: "Amaya Perera",
      email: "amaya@example.com",
      phone: "0771234567",
    }),
    [addresses, setAddresses] = useLocalStorage("paperist-addresses", [
      {
        id: "1",
        name: "Home",
        address: "24 Flower Road, Colombo 07",
        default: true,
      },
    ]),
    [content, setContent] = useLocalStorage(
      "paperist-content",
      defaultHomeContent,
      migrateHomeContent,
    ),
    [toast, setToast] = useState("");
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const [remoteProducts, setRemoteProducts] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState(
    supabaseConfigured ? "loading" : "demo",
  );
  const [catalogError, setCatalogError] = useState("");
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const refreshProducts = () => {
    setCatalogStatus("loading");
    setCatalogAttempt((value) => value + 1);
  };
  useEffect(() => {
    if (!supabaseConfigured) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    fetchPublishedProducts(supabase, controller.signal)
      .then((data) => {
        if (active) {
          setRemoteProducts(data);
          setCatalogStatus("ready");
          setCatalogError("");
        }
      })
      .catch((error) => {
        if (active) {
          setCatalogStatus("error");
          setCatalogError(error.message || "The catalog could not be loaded.");
        }
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [catalogAttempt]);
  const products =
    isAdmin || !supabaseConfigured ? localProducts : remoteProducts;
  const setProducts =
    isAdmin || !supabaseConfigured
      ? setLocalProducts
      : () => notify("Live product editing requires authorised admin access.");
  useEffect(() => {
    const handle = () => {
      setToast(
        "Local demo storage is full. Use smaller images to save more changes.",
      );
      setTimeout(() => setToast(""), 5000);
    };
    window.addEventListener("paperist-storage-error", handle);
    return () => window.removeEventListener("paperist-storage-error", handle);
  }, []);
  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
  };
  const addToCart = (product, quantity = 1, variant = {}) => {
    if (!product.stock) {
      notify("This item is out of stock");
      return;
    }
    const key = product.id + JSON.stringify(variant);
    setCart((old) => {
      const found = old.find((x) => x.key === key);
      return found
        ? old.map((x) =>
            x.key === key
              ? {
                  ...x,
                  quantity: Math.min(product.stock, x.quantity + quantity),
                }
              : x,
          )
        : [
            ...old,
            {
              key,
              productId: product.id,
              quantity: Math.min(product.stock, quantity),
              variant,
            },
          ];
    });
    notify("Added to your bag");
  };
  const toggleWishlist = (id) =>
    setWishlist((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  const subtotal = cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId);
    return sum + (p?.salePrice ?? p?.price ?? 0) * item.quantity;
  }, 0);
  return (
    <Context.Provider
      value={{
        products,
        catalogStatus,
        catalogError,
        refreshProducts,
        setProducts,
        orders,
        setOrders,
        cart,
        setCart,
        wishlist,
        toggleWishlist,
        addToCart,
        subtotal,
        notify,
        profile,
        setProfile,
        addresses,
        setAddresses,
        content,
        setContent,
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
        </div>
      )}
    </Context.Provider>
  );
}
