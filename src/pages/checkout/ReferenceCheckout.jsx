import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { ReferenceHeader, ReferenceFooter } from "../store/ReferenceShop";
import { ProductArt } from "../store/ReferenceProduct";
import "../../reference-shipping.css";
export default function ReferenceCheckout() {
  const {
    cart,
    setCart,
    products,
    orders,
    setOrders,
    notify,
    catalogStatus,
    refreshProducts,
  } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0),
    [info, setInfo] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      address2: "",
      city: "",
      postal: "",
      province: "",
      country: "Sri Lanka",
    }),
    [delivery, setDelivery] = useState("Standard delivery"),
    [payment, setPayment] = useState("Cash on Delivery"),
    [code, setCode] = useState(""),
    [discountRate, setDiscountRate] = useState(() =>
      Number(sessionStorage.getItem("paperist-discount") || 0),
    );
  const items = cart
      .map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }))
      .filter((item) => item.product),
    subtotal = items.reduce(
      (sum, item) =>
        sum + (item.product.salePrice ?? item.product.price) * item.quantity,
      0,
    ),
    shipping = items.length
      ? delivery === "Express delivery"
        ? 650
        : subtotal >= 5000
          ? 0
          : 350
      : 0,
    discount = subtotal * discountRate,
    total = subtotal - discount + shipping,
    canOrder =
      items.length > 0 &&
      items.every(
        (item) => item.product.stock >= item.quantity && item.quantity > 0,
      );
  const fields = [
    ["name", "Full Name", "John Doe", "text", true],
    ["phone", "Phone Number", "077 123 4567", "tel", true],
    ["address", "Address Line 1", "House No, Street Name", "text", true],
    [
      "address2",
      "Address Line 2 (Optional)",
      "Apartment, Suite, etc.",
      "text",
      false,
    ],
    ["city", "City", "Colombo", "text", true],
    ["postal", "Postal Code", "00000", "text", true],
    ["province", "Province / State", "Western Province", "text", true],
    ["email", "Email Address", "you@example.com", "email", true],
  ];
  const setQuantity = (item, quantity) =>
    setCart((old) =>
      old.map((x) =>
        x.key === item.key
          ? {
              ...x,
              quantity: Math.max(1, Math.min(item.product.stock, quantity)),
            }
          : x,
      ),
    );
  const applyCode = (e) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === "PAPER10") {
      setDiscountRate(0.1);
      sessionStorage.setItem("paperist-discount", "0.1");
      notify("10% off applied");
    } else notify("That code is not valid. Please try again.");
  };
  const finish = () => {
    if (!canOrder) return;
    const order = {
      id: "PPR-" + Date.now().toString().slice(-6),
      customer: info.name,
      email: info.email,
      phone: info.phone,
      date: new Date().toISOString().slice(0, 10),
      items: cart,
      address: [
        info.address,
        info.address2,
        info.city,
        info.province,
        info.postal,
        info.country,
      ]
        .filter(Boolean)
        .join(", "),
      method: payment,
      payment: "Pending",
      status: "Pending",
      total,
      delivery,
      deliveryPartner: "Standard courier",
    };
    setOrders([order, ...orders]);
    sessionStorage.setItem("paperist-last-order", order.id);
    setCart([]);
    sessionStorage.removeItem("paperist-discount");
    navigate("/order-success");
  };
  return (
    <div className="reference-shop reference-shipping">
      <ReferenceHeader home active="" />
      <section className="sh-banner">
        <div>
          <h1>
            Checkout<span>.</span>
          </h1>
          <p>
            Almost there!
            <br />
            <small>
              Good ideas are on the way. <i>♥</i>
            </small>
          </p>
        </div>
        <div className="sh-banner-note">
          Good
          <br />
          People
          <br />
          Good
          <br />
          Ideas. <i>♥</i>
        </div>
      </section>
      <main className="sh-main">
        {catalogStatus === "loading" ? (
          <p role="status">Loading checkout…</p>
        ) : catalogStatus === "error" ? (
          <div className="sh-empty">
            <h2>We couldn’t load checkout.</h2>
            <button onClick={refreshProducts}>Try again</button>
          </div>
        ) : !items.length ? (
          <div className="sh-empty">
            <ShoppingEmpty />
            <h2>Your bag is waiting for a good idea.</h2>
            <Link to="/shop">
              Explore the shop <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="sh-columns">
            <section className="sh-form-column">
              <h1 className="sh-title">
                Checkout<span>.</span>
              </h1>
              <nav className="sh-steps" aria-label="Checkout progress">
                {["Shipping", "Payment", "Confirmation"].map((label, i) => (
                  <button
                    key={label}
                    disabled={i > step}
                    aria-current={i === step ? "step" : undefined}
                    className={i === step ? "active" : i < step ? "done" : ""}
                    onClick={() => setStep(i)}
                  >
                    <b>{i < step ? <Check size={18} /> : i + 1}</b>
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
              {step === 0 ? (
                <form
                  className="sh-panel sh-address"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canOrder) {
                      setStep(1);
                      window.scrollTo({ top: 220, behavior: "smooth" });
                    }
                  }}
                >
                  <h2>
                    Shipping Address<span>.</span>
                  </h2>
                  <div className="sh-field-grid">
                    {fields.map(([key, label, placeholder, type, required]) => (
                      <label
                        className={
                          "sh-field " + (key === "address" ? "wide" : "")
                        }
                        key={key}
                      >
                        <span>
                          {label}
                          {required && <i>*</i>}
                        </span>
                        <input
                          name={key}
                          aria-label={label}
                          type={type}
                          required={required}
                          placeholder={placeholder}
                          autoComplete={
                            {
                              name: "name",
                              phone: "tel",
                              email: "email",
                              address: "address-line1",
                              address2: "address-line2",
                              city: "address-level2",
                              postal: "postal-code",
                              province: "address-level1",
                            }[key]
                          }
                          value={info[key]}
                          pattern={key === "postal" ? "[0-9]{5}" : undefined}
                          inputMode={key === "postal" ? "numeric" : undefined}
                          onChange={(e) =>
                            setInfo({ ...info, [key]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                    <label className="sh-field">
                      <span>
                        Country<i>*</i>
                      </span>
                      <select
                        name="country"
                        aria-label="Country"
                        value={info.country}
                        onChange={(e) =>
                          setInfo({ ...info, country: e.target.value })
                        }
                      >
                        <option>Sri Lanka</option>
                      </select>
                    </label>
                  </div>
                  <fieldset className="sh-delivery">
                    <legend>
                      Delivery Method<span>.</span>
                    </legend>
                    {[
                      [
                        "Standard delivery",
                        subtotal >= 5000 ? "Free" : "Rs. 350",
                        "3–5 business days",
                      ],
                      ["Express delivery", "Rs. 650", "1–2 business days"],
                    ].map(([value, price, note]) => (
                      <label
                        className={delivery === value ? "selected" : ""}
                        key={value}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={value}
                          checked={delivery === value}
                          onChange={() => setDelivery(value)}
                        />
                        <Truck size={29} />
                        <span>
                          <strong>
                            {value} ({price})
                          </strong>
                          <small>{note}</small>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  <button className="sh-primary" disabled={!canOrder}>
                    Continue to Payment <ArrowRight size={19} />
                  </button>
                  {!canOrder && (
                    <p className="sh-error">
                      Please remove unavailable items before continuing.
                    </p>
                  )}
                </form>
              ) : step === 1 ? (
                <section className="sh-panel sh-payment">
                  <h2>
                    Payment Method<span>.</span>
                  </h2>
                  <p>Choose how you’d like to pay.</p>
                  {[
                    [
                      "Cash on Delivery",
                      "Pay in cash when your order arrives.",
                    ],
                    [
                      "Bank Transfer",
                      "Your order will stay pending until payment is confirmed.",
                    ],
                  ].map(([value, note]) => (
                    <label
                      key={value}
                      className={payment === value ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === value}
                        onChange={() => setPayment(value)}
                      />
                      <CreditCard size={26} />
                      <span>
                        <strong>{value}</strong>
                        <small>{note}</small>
                      </span>
                    </label>
                  ))}
                  <div className="sh-address-preview">
                    <h3>Deliver to</h3>
                    <p>
                      {info.name}
                      <br />
                      {info.address}
                      {info.address2 && ", " + info.address2}
                      <br />
                      {info.city}, {info.province} {info.postal}
                      <br />
                      {info.phone}
                    </p>
                    <button onClick={() => setStep(0)}>
                      Edit shipping details
                    </button>
                  </div>
                  <button
                    className="sh-primary"
                    disabled={!canOrder}
                    onClick={() => setStep(2)}
                  >
                    Review Order <ArrowRight size={19} />
                  </button>
                  <p className="sh-demo">
                    Demo checkout. No payment is processed.
                  </p>
                </section>
              ) : (
                <section className="sh-panel sh-confirm">
                  <h2>
                    Review Your Order<span>.</span>
                  </h2>
                  <p>
                    You’re almost there. Check your details before placing your
                    order.
                  </p>
                  <dl>
                    <div>
                      <dt>Customer</dt>
                      <dd>
                        {info.name}
                        <br />
                        {info.email}
                        <br />
                        {info.phone}
                      </dd>
                    </div>
                    <div>
                      <dt>Shipping address</dt>
                      <dd>
                        {info.address}
                        <br />
                        {info.address2 && (
                          <>
                            {info.address2}
                            <br />
                          </>
                        )}
                        {info.city}, {info.province} {info.postal}
                        <br />
                        {info.country}
                      </dd>
                    </div>
                    <div>
                      <dt>Delivery</dt>
                      <dd>{delivery}</dd>
                    </div>
                    <div>
                      <dt>Payment</dt>
                      <dd>{payment}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>{money(total)}</dd>
                    </div>
                  </dl>
                  <button
                    className="sh-primary"
                    disabled={!canOrder}
                    onClick={finish}
                  >
                    Place Demo Order <ArrowRight size={19} />
                  </button>
                  <p className="sh-demo">
                    Demo checkout. No payment is processed.
                  </p>
                  <button className="sh-back" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} />
                    Back to payment
                  </button>
                </section>
              )}
            </section>
            <aside className="sh-panel sh-summary">
              <h2>
                Order Summary<span>.</span>
              </h2>
              <div className="sh-summary-items">
                {items.map((item) => {
                  const p = item.product;
                  return (
                    <article key={item.key}>
                      <Link className="sh-item-image" to={"/product/" + p.slug}>
                        <ProductArt product={p} />
                      </Link>
                      <div className="sh-item-name">
                        <Link to={"/product/" + p.slug}>{p.name}</Link>
                        <p>
                          {item.variant?.Size || p.variants?.Size?.[0]}
                          {item.variant?.["Paper Type"]
                            ? " - " + item.variant["Paper Type"]
                            : ""}
                        </p>
                        {item.variant?.Colour && (
                          <p>Colour: {item.variant.Colour}</p>
                        )}
                        {!p.stock && <p className="sh-error">Out of stock</p>}
                      </div>
                      <div className="sh-item-quantity">
                        <button
                          aria-label={"Decrease quantity of " + p.name}
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <output aria-label={"Quantity of " + p.name}>
                          {item.quantity}
                        </output>
                        <button
                          aria-label={"Increase quantity of " + p.name}
                          disabled={item.quantity >= p.stock}
                          onClick={() => setQuantity(item, item.quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <strong className="sh-item-price">
                        {money((p.salePrice ?? p.price) * item.quantity)}
                      </strong>
                      <button
                        className="sh-remove"
                        aria-label={"Remove " + p.name}
                        onClick={() =>
                          setCart((old) =>
                            old.filter((x) => x.key !== item.key),
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </article>
                  );
                })}
              </div>
              <dl className="sh-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{money(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div>
                    <dt>Discount</dt>
                    <dd>− {money(discount)}</dd>
                  </div>
                )}
                <div>
                  <dt>Delivery</dt>
                  <dd>{shipping ? money(shipping) : "Free"}</dd>
                </div>
                <div className="sh-total">
                  <dt>Total</dt>
                  <dd>{money(total)}</dd>
                </div>
              </dl>
              <form className="sh-coupon" onSubmit={applyCode}>
                <Ticket size={25} />
                <input
                  aria-label="Coupon code"
                  placeholder="Have a coupon code?"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button>Apply</button>
              </form>
              {discountRate > 0 && (
                <button
                  className="sh-discount-remove"
                  onClick={() => {
                    setDiscountRate(0);
                    sessionStorage.removeItem("paperist-discount");
                  }}
                >
                  Remove discount
                </button>
              )}
              <div className="sh-perks">
                {[
                  [Truck, "Secure Delivery"],
                  [ShieldCheck, "Safe Payment"],
                  [Package, "Easy Returns"],
                ].map(([Icon, label]) => (
                  <div key={label}>
                    <Icon size={27} />
                    {label}
                  </div>
                ))}
              </div>
              <div className="sh-summary-art">
                <p>
                  Good
                  <br />
                  Ideas
                  <br />
                  On The Way<span>♥</span>
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <ReferenceFooter />
    </div>
  );
}
function ShoppingEmpty() {
  return <Package size={42} />;
}
