import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { X, Minus, Plus, Star, ArrowUpRight } from "lucide-react";
export function Button({ children, to, secondary = false, ...props }) {
  return to ? (
    <Link
      className={`button ${secondary ? "secondary" : ""}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <button className={`button ${secondary ? "secondary" : ""}`} {...props}>
      {children}
    </button>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  to = "/shop",
  link = "Explore all",
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>
          {title}
          <span className="red-dot">.</span>
        </h2>
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {link} <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumb({ name }) {
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <span>/</span>
      <span>{name}</span>
    </div>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  text = "Your next favourite is waiting to be discovered.",
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <Button to="/shop">Explore the shop</Button>
    </div>
  );
}
export function RatingStars({ rating = 4.8, count }) {
  return (
    <span className="rating">
      <Star size={13} fill="currentColor" /> {rating}{" "}
      {count && <span>({count})</span>}
    </span>
  );
}
export function QuantitySelector({ value, onChange, max = 99 }) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus size={14} />
      </button>
      <span>{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function Modal({ title, children, onClose }) {
  const dialog = useRef(null),
    close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement;
    const focusables = () =>
      Array.from(
        dialog.current.querySelectorAll(
          "button:not([disabled]),input,select,textarea,a[href]",
        ),
      );
    focusables()[0]?.focus();
    const keyboard = (e) => {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab") {
        const nodes = focusables(),
          first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("keydown", keyboard);
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="modal"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="section-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function LoadingSkeleton() {
  return <div className="skeleton" aria-label="Loading" />;
}
export function Field({ label, type = "text", options, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select {...props}>
          {options.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea rows="4" {...props} />
      ) : (
        <input type={type} {...props} />
      )}
    </label>
  );
}
export function Status({ children }) {
  return (
    <span
      className={`status ${String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
