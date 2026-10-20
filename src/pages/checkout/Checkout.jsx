import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, MapPin, ShieldCheck } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import PaymentLayout from "./PaymentLayout";
import { OrderSummary } from "../store/Cart";
import { Field, Button, EmptyState } from "../../components/common/UI";
import { money } from "../../data/products";
export default function Checkout() {
  const { cart, setCart, products, subtotal, orders, setOrders } = useShop(),
    navigate = useNavigate();
  const [step, setStep] = useState(0),
    [delivery, setDelivery] = useState("Standard delivery"),
    [payment, setPayment] = useState("Cash on Delivery"),
    [partner, setPartner] = useState("PickMe"),
    [info, setInfo] = useState({});
  const shipping =
    delivery === "Store pickup"
      ? 0
      : delivery === "Express delivery"
        ? 650
        : subtotal >= 5000
          ? 0
          : 350;
  const discount =
    subtotal * Number(sessionStorage.getItem("paperist-discount") || 0);
  if (!cart.length)
    return (
      <div className="container page">
        <EmptyState title="Add something lovely before checking out" />
      </div>
    );
  const finish = () => {
    const order = {
      id: "PPR-" + Date.now().toString().slice(-6),
      customer: info["First name"] + " " + info["Last name"],
      email: info.Email,
      phone: info["Mobile number"],
      date: new Date().toISOString().slice(0, 10),
      items: cart,
      address: [
        info.Address,
        info.City,
        info.District,
        info["Postal code"],
      ].join(", "),
      method: payment,
      payment: payment === "Cash on Delivery" ? "Pending" : "Mock pending",
      status: "Pending",
      total: subtotal - discount + shipping,
      delivery,
      deliveryPartner: partner,
    };
    setOrders([order, ...orders]);
    sessionStorage.setItem("paperist-last-order", order.id);
    setCart([]);
    sessionStorage.removeItem("paperist-discount");
    navigate("/order-success");
  };
  if (step === 2) return <PaymentLayout {...{cart, setCart, products, subtotal, discount, shipping, partner, setPartner, payment, setPayment, info, finish}} onEdit={() => setStep(0)} />;
  return (
    <div className="container page shopping-checkout">
      <Link className="text-link" to="/cart">
        ← Back to bag
      </Link>
      <h1>
        A little closer to yours<span className="red-dot">.</span>
      </h1>
      <div className="checkout-steps">
        {["Information", "Delivery", "Payment"].map((x, i) => (
          <button
            disabled={i > step}
            className={i === step ? "active" : ""}
            onClick={() => setStep(i)}
            key={x}
          >
            <span>
              {i < step ? <Check size={17} /> : String(i + 1).padStart(2, "0")}
            </span>
            {x}
          </button>
        ))}
      </div>
      <div className="cart-layout">
        <section className="panel">
          <h2>
            {
              [
                "Your information",
                "How should it get to you?",
                "Choose a payment method",
              ][step]
            }
          </h2>
          {step === 0 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              <div className="form-grid">
                {[
                  "First name",
                  "Last name",
                  "Email",
                  "Mobile number",
                  "Address",
                  "City",
                  "District",
                  "Postal code",
                ].map((label) => (
                  <Field
                    key={label}
                    label={label}
                    type={
                      label === "Email"
                        ? "email"
                        : label === "Mobile number"
                          ? "tel"
                          : "text"
                    }
                    required
                    value={info[label] || ""}
                    onChange={(e) =>
                      setInfo({ ...info, [label]: e.target.value })
                    }
                  />
                ))}
              </div>
              <Button>Continue to delivery →</Button>
            </form>
          ) : step === 1 ? (
            <>
              <div className="partner-preview">
                <h3>Choose your delivery partner</h3>
                <div className="partner-choice-row">
                  {["PickMe", "Uber"].map((name) => (
                    <button
                      type="button"
                      key={name}
                      className={`partner-choice ${name.toLowerCase()} ${partner === name ? "selected" : ""}`}
                      onClick={() => setPartner(name)}
                      aria-pressed={partner === name}
                      aria-label={name}
                    >
                      <img className="partner-original-logo" src={`/images/${name.toLowerCase()}-logo.png`} alt="" />
                      <span>{name}</span>
                      {partner === name && <Check size={18} />}
                    </button>
                  ))}
                </div>
                <p className="demo-note">
                  Delivery partner preview. No courier booking, live quote, or
                  tracking is created.
                </p>
                <div className="partner-location">
                  <MapPin size={24} />
                  <div>
                    <strong>Drop-off location</strong>
                    <p>
                      {info.Address}, {info.City}, {info.District}
                    </p>
                  </div>
                  <button className="text-link" onClick={() => setStep(0)}>
                    Change
                  </button>
                </div>
              </div>
              <div className="radio-options">
                {["Standard delivery", "Express delivery", "Store pickup"].map(
                  (x, i) => (
                    <label className={delivery === x ? "chosen" : ""} key={x}>
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === x}
                        onChange={() => setDelivery(x)}
                      />
                      <span>
                        <strong>{x}</strong>
                        <small>
                          {
                            [
                              "3–5 business days · Rs. 350 (free over Rs. 5,000)",
                              "1–2 business days · Rs. 650",
                              "Colombo store · Free",
                            ][i]
                          }
                        </small>
                      </span>
                    </label>
                  ),
                )}
              </div>
              <Button onClick={() => setStep(2)}>Continue to payment →</Button>
            </>
          ) : (
            <>
              <div className="demo-note">
                Demo checkout. No payment will be processed. Please use
                fictional details.
              </div>
              <div className="radio-options">
                {[
                  "Card",
                  "KOKO (preview)",
                  "Bank Transfer",
                  "Cash on Delivery",
                ].map((x) => (
                  <label className={payment === x ? "chosen" : ""} key={x}>
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === x}
                      onChange={() => setPayment(x)}
                    />
                    <strong>{x}</strong>
                  </label>
                ))}
              </div>
              {payment === "KOKO (preview)" ? (
                <div className="koko-preview">
                  <div className="koko-title">
                    <h3>Pay with KOKO</h3>
                    <img className="koko-logo" src="/images/koko-logo.png" alt="KOKO" />
                  </div>
                  <p>
                    Illustrative three-part payment plan. Eligibility, fees and
                    terms require confirmation from KOKO.
                  </p>
                  <div className="summary-line">
                    <span>Total amount</span>
                    <strong>{money(subtotal - discount + shipping)}</strong>
                  </div>
                  <div className="installment-grid">
                    {["Today", "In 30 days", "In 60 days"].map(
                      (label, index) => {
                        const totalCents = Math.round(
                          (subtotal - discount + shipping) * 100,
                        );
                        const part = Math.floor(totalCents / 3);
                        return (
                          <div key={label}>
                            <strong>
                              {money(
                                (index === 2 ? totalCents - part * 2 : part) /
                                  100,
                              )}
                            </strong>
                            <small>{label}</small>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <p className="demo-note">
                    Preview only — no KOKO payment or credit agreement is
                    created.
                  </p>
                </div>
              ) : payment === "Card" ? (
                <p className="demo-note">
                  Card payment preview selected. Real card details are not
                  collected in Phase 1.
                </p>
              ) : payment === "Bank Transfer" ? (
                <p>
                  Demo bank transfer instructions will appear in your order
                  summary.
                </p>
              ) : (
                <p>Pay when your stationery arrives at your door.</p>
              )}
              <Button onClick={finish}>Place demo order</Button>
              <p className="checkout-secure">
                <ShieldCheck size={15} /> Real payment details are not
                collected.
              </p>
              <p className="muted">
                By placing this demo order, you accept our{" "}
                <Link to="/terms">terms</Link>.
              </p>
            </>
          )}
        </section>
        <OrderSummary discount={discount} delivery={shipping} />
      </div>
    </div>
  );
}
export function OrderSuccess() {
  const { orders } = useShop();
  const order = orders.find(
    (x) => x.id === sessionStorage.getItem("paperist-last-order"),
  );
  return (
    <div className="container page success reference-success">
      <div className="success-icon">
        <Check size={42} />
      </div>
      <span className="eyebrow">A GOOD IDEA IS ON ITS WAY</span>
      <h1>Thank you for your order!</h1>
      <p>
        Your next chapter starts here. This demo order is saved on this device.
      </p>
      {order && (
        <section className="panel success-summary">
          <h3>{order.id}</h3>
          <div className="summary-line">
            <span>Total</span>
            <strong>{money(order.total)}</strong>
          </div>
          <p>{order.address}</p>
          <p>
            {order.method} · {order.delivery}
          </p>
          <p>Estimated delivery: 3–5 business days</p>
        </section>
      )}
      <div className="button-row">
        <Button to="/track-order">Track order</Button>
        <Button secondary to="/shop">
          Continue shopping
        </Button>
      </div>
      <div className="success-stationery-art" aria-hidden="true" />
    </div>
  );
}
export function TrackOrder() {
  const { orders } = useShop(),
    [result, setResult] = useState(null),
    [error, setError] = useState("");
  const statuses = [
    "Order placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
  ];
  return (
    <div className="container page narrow">
      <span className="eyebrow">FOLLOW YOUR LITTLE DELIVERY</span>
      <h1>
        Track your order<span className="red-dot">.</span>
      </h1>
      <p>Enter your order details. Try PPR-1042 and amaya@example.com.</p>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.target);
          const order = orders.find(
            (x) =>
              x.id.toLowerCase() === data.get("order").trim().toLowerCase() &&
              (x.email.toLowerCase() ===
                data.get("contact").trim().toLowerCase() ||
                (x.phone &&
                  x.phone.replace(/\D/g, "") ===
                    data.get("contact").replace(/\D/g, ""))),
          );
          setResult(order || null);
          setError(
            order
              ? ""
              : "We couldn’t match those details. Please check and try again.",
          );
        }}
      >
        <Field
          label="Order number"
          name="order"
          required
          placeholder="PPR-1042"
        />
        <Field
          label="Email / mobile"
          name="contact"
          required
          placeholder="amaya@example.com"
        />
        <Button>Find my order</Button>
        {error && (
          <p role="alert" className="red">
            {error}
          </p>
        )}
      </form>
      {result && (
        <section className="panel">
          <h3>{result.id}</h3>
          <p>{result.address}</p>
          <div className="timeline">
            {statuses.map((x, i) => (
              <div
                className={
                  i <=
                  [
                    "Pending",
                    "Confirmed",
                    "Packed",
                    "Shipped",
                    "Delivered",
                  ].indexOf(result.status)
                    ? "complete"
                    : ""
                }
                key={x}
              >
                <span>
                  <Check size={14} />
                </span>
                <strong>{x}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
