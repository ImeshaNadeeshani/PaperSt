import { ReferenceHeader, ReferenceFooter } from "../pages/store/ReferenceShop";
import ReferenceWishlist from "../pages/store/ReferenceWishlist";
import { useEffect } from "react";
import ReferenceShop from "../pages/store/ReferenceShop";
import ReferenceHome from "../pages/store/ReferenceHome";
import ReferenceSchool from "../pages/store/ReferenceSchool";
import ReferenceCart from "../pages/store/ReferenceCart";
import ReferenceAbout from "../pages/store/ReferenceAbout";
import ReferenceOffice from "../pages/store/ReferenceOffice";
import ReferenceCheckout from "../pages/checkout/ReferenceCheckout";
import ReferenceProduct from "../pages/store/ReferenceProduct";
import { Outlet, useLocation } from "react-router-dom";
import {
  ShoppingBag,
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
          notify("Youâ€™re on the list. Thank you!");
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
  const { content, catalogStatus, refreshProducts } = useShop();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  if (location.pathname === "/") return <ReferenceHome />;
  if (location.pathname === "/shop") return <ReferenceShop />;
  if (location.pathname.startsWith("/product/"))
    return (
      <ReferenceProduct
        key={location.pathname}
        slug={decodeURIComponent(location.pathname.slice(9))}
      />
    );
  if (["/category/school", "/back-to-school"].includes(location.pathname))
    return <ReferenceSchool />;
  if (location.pathname === "/cart") return <ReferenceCart />;
  if (location.pathname === "/checkout") return <ReferenceCheckout />;
  if (location.pathname === "/about") return <ReferenceAbout />;
  if (location.pathname === "/category/office") return <ReferenceOffice />;
  if (
    location.pathname === "/account" ||
    location.pathname.startsWith("/account/")
  )
    return <Outlet />;
  if (location.pathname === "/wishlist") return <ReferenceWishlist />;
  return (
    <div
      className={`store-shell ${location.pathname === "/category/notebooks" ? "notebook-shell" : ""}`}
    >
      <div
        className={`announcement ${location.pathname === "/" ? "home-announcement" : ""}`}
      >
        A little stationery. A lot of possibility.{" "}
        <span>Free delivery on orders over Rs. 5,000 â†—</span>
      </div>
      <ReferenceHeader />
      <main>
        {catalogStatus === "loading" ? (
          <div className="container page" role="status">
            Loading productsâ€¦
          </div>
        ) : catalogStatus === "error" ? (
          <div className="container page" role="alert">
            <h1>We couldn't load the shop.</h1>
            <p>Please check your connection and try again.</p>
            <button className="button" onClick={refreshProducts}>
              Try again
            </button>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      {content.find((x) => x.name === "Newsletter")?.visible !== false && (
        <Newsletter />
      )}
      <ReferenceFooter />
    </div>
  );
}
