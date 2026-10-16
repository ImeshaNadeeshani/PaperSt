import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Link, useParams } from "react-router-dom";
import { Plus, Trash2, Edit, Check } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import {
  Button,
  Field,
  Modal,
  Status,
  EmptyState,
} from "../../components/common/UI";
export function OrderTable({ orders, admin = false }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "Order",
              "Customer",
              "Date",
              "Total",
              "Payment",
              ...(admin ? ["Fulfilment"] : []),
              "Status",
              "",
            ].map((x) => (
              <th key={x}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link
                  className="text-link"
                  to={`${admin ? "/admin" : "/account"}/orders/${o.id}`}
                >
                  #{o.id}
                </Link>
              </td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td>{money(o.total)}</td>
              <td>{o.payment}</td>
              {admin && (
                <td>
                  {["Shipped", "Delivered"].includes(o.status)
                    ? "Fulfilled"
                    : "Unfulfilled"}
                </td>
              )}
              <td>
                <Status>{o.status}</Status>
              </td>
              <td>
                <Link to={`${admin ? "/admin" : "/account"}/orders/${o.id}`}>
                  View ↗
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function AccountOverview() {
  const { profile, orders, wishlist, addresses } = useShop();
  const own = orders.filter((x) => x.email === profile.email);
  return (
    <>
      <h2>Hello, {profile.name.split(" ")[0]} 👋</h2>
      <p className="muted">Here’s what’s happening in your little corner.</p>
      <div className="stat-grid">
        {[
          ["Orders", own.length],
          ["Saved favourites", wishlist.length],
          ["Reward points", 240],
        ].map(([name, value]) => (
          <div className="stat panel" key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="section-header">
          <h3>Recent orders</h3>
          <Link to="/account/orders">View all →</Link>
        </div>
        <OrderTable orders={own.slice(0, 3)} />
      </div>
      <div className="panel">
        <h3>Your default address</h3>
        <p>
          {addresses.find((x) => x.default)?.address ||
            "Add an address to get started."}
        </p>
        <Link className="text-link" to="/account/addresses">
          Manage addresses ↗
        </Link>
      </div>
    </>
  );
}
export function MyOrders() {
  const { orders, profile } = useShop(),
    [filter, setFilter] = useState("All");
  const own = orders.filter(
    (x) =>
      x.email === profile.email && (filter === "All" || x.status === filter),
  );
  return (
    <div className="panel">
      <div className="section-header">
        <h2>My orders</h2>
        <select
          aria-label="Filter orders"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      {own.length ? (
        <OrderTable orders={own} />
      ) : (
        <EmptyState title="No orders yet" />
      )}
    </div>
  );
}
export function OrderDetails({ admin = false }) {
  const { id } = useParams(),
    { orders, setOrders, products, addToCart, notify } = useShop(),
    [note, setNote] = useState("");
  const order = orders.find((x) => x.id === id);
  if (!order) return <EmptyState title="Order not found" />;
  return (
    <>
      <div className="section-header">
        <div>
          <span className="eyebrow">ORDER DETAILS</span>
          <h2>#{order.id}</h2>
        </div>
        <Status>{order.status}</Status>
      </div>
      <div className="panel">
        <div className="section-header">
          <span>{order.date}</span>
          {admin && (
            <select
              aria-label="Order status"
              value={order.status}
              onChange={(e) => {
                setOrders((old) =>
                  old.map((x) =>
                    x.id === id ? { ...x, status: e.target.value } : x,
                  ),
                );
                notify("Order status updated");
              }}
            >
              {[
                "Pending",
                "Confirmed",
                "Processing",
                "Packed",
                "Shipped",
                "Delivered",
                "Cancelled",
                "Returned",
                "Refunded",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          )}
        </div>
        {order.items.map((item, i) => {
          const p = products.find((x) => x.id === item.productId);
          return (
            p && (
              <div className="summary-item" key={i}>
                <img src={p.images[0]} alt={p.name} />
                <div>
                  <strong>{p.name}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <span>{money((p.salePrice ?? p.price) * item.quantity)}</span>
              </div>
            )
          );
        })}
        <div className="summary-line total">
          <strong>Total</strong>
          <strong>{money(order.total)}</strong>
        </div>
        <div className="button-row">
          <Button
            onClick={() => {
              order.items.forEach((item) => {
                const p = products.find((x) => x.id === item.productId);
                if (p) addToCart(p, item.quantity);
              });
            }}
          >
            Reorder
          </Button>
          <Button secondary onClick={() => window.print()}>
            Print invoice
          </Button>
          <Button secondary to="/track-order">
            Track order
          </Button>
        </div>
      </div>
      <div className="two-columns">
        <section className="panel">
          <h3>Customer & delivery</h3>
          <p>
            {order.customer}
            <br />
            {order.email}
          </p>
          <p>{order.address}</p>
          <p>Estimated arrival: 3–5 business days</p>
        </section>
        <section className="panel">
          <h3>Payment</h3>
          <p>{order.method}</p>
          <Status>{order.payment}</Status>
          <h3>Order timeline</h3>
          <p>Placed {order.date}</p>
          <p>Current status: {order.status}</p>
        </section>
      </div>
      {admin && (
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setOrders((old) =>
              old.map((x) =>
                x.id === id ? { ...x, notes: [...(x.notes || []), note] } : x,
              ),
            );
            setNote("");
            notify("Internal note added");
          }}
        >
          <h3>Internal notes</h3>
          {order.notes?.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
          <Field
            label="Add a note"
            type="textarea"
            value={note}
            required
            onChange={(e) => setNote(e.target.value)}
          />
          <Button>Save note</Button>
        </form>
      )}
    </>
  );
}
export function Addresses() {
  const { addresses, setAddresses, notify } = useShop(),
    [editing, setEditing] = useState(null);
  return (
    <>
      <div className="section-header">
        <h2>Your addresses</h2>
        <Button onClick={() => setEditing({ name: "", address: "" })}>
          <Plus size={16} /> Add address
        </Button>
      </div>
      <div className="two-columns">
        {addresses.map((a) => (
          <section className="panel" key={a.id}>
            <h3>
              {a.name} {a.default && <Status>Default</Status>}
            </h3>
            <p>{a.address}</p>
            <div className="button-row">
              <button className="text-link" onClick={() => setEditing(a)}>
                <Edit size={15} />
                Edit
              </button>
              <button
                className="text-link"
                onClick={() =>
                  setAddresses((old) => old.filter((x) => x.id !== a.id))
                }
              >
                <Trash2 size={15} />
                Delete
              </button>
              {!a.default && (
                <button
                  className="text-link"
                  onClick={() =>
                    setAddresses((old) =>
                      old.map((x) => ({ ...x, default: x.id === a.id })),
                    )
                  }
                >
                  <Check size={15} />
                  Set default
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
      {editing && (
        <Modal
          title={editing.id ? "Edit address" : "Add address"}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const saved = {
                ...editing,
                id: editing.id || String(Date.now()),
                default: editing.default || !addresses.length,
              };
              setAddresses((old) =>
                editing.id
                  ? old.map((x) => (x.id === editing.id ? saved : x))
                  : [...old, saved],
              );
              setEditing(null);
              notify("Address saved");
            }}
          >
            <Field
              label="Address label"
              required
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <Field
              label="Full address"
              type="textarea"
              required
              value={editing.address}
              onChange={(e) =>
                setEditing({ ...editing, address: e.target.value })
              }
            />
            <Button>Save address</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Profile() {
  const { profile, setProfile, notify } = useShop();
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        setProfile(Object.fromEntries(data));
        notify("Profile saved");
      }}
    >
      <h2>A little about you</h2>
      {[
        ["Name", "name", "text"],
        ["Email", "email", "email"],
        ["Phone", "phone", "tel"],
        ["Birthday", "birthday", "date"],
      ].map(([label, name, type]) => (
        <Field
          key={name}
          label={label}
          name={name}
          type={type}
          defaultValue={profile[name]}
          required={name !== "birthday"}
        />
      ))}
      <Button>Save profile</Button>
    </form>
  );
}
export function Password() {
  const { notify } = useShop(),
    [error, setError] = useState("");
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        if (data.get("New password") !== data.get("Confirm password")) {
          setError("Your new passwords must match.");
          return;
        }
        setError("");
        notify("Demo password form validated. No credentials stored.");
        e.target.reset();
      }}
    >
      <h2>Password & security</h2>
      <p className="demo-note">Use a fictional password for this demo.</p>
      {["Current password", "New password", "Confirm password"].map((x) => (
        <Field
          key={x}
          label={x}
          name={x}
          type="password"
          minLength={8}
          required
        />
      ))}
      {error && (
        <p role="alert" className="red">
          {error}
        </p>
      )}
      <Button>Update password</Button>
    </form>
  );
}
export function Notifications() {
  const { notify } = useShop();
  const [preferences, setPreferences] = useLocalStorage(
    "paperist-notification-preferences",
    {},
  );
  return (
    <form
      className="panel"
      onSubmit={(e) => {
        e.preventDefault();
        notify("Notification preferences saved");
      }}
    >
      <h2>Keep in the loop</h2>
      {["Order updates", "New collections", "Offers & little treats"].map(
        (x) => (
          <label className="notification-row" key={x}>
            <span>{x}</span>
            <input
              type="checkbox"
              checked={preferences[x] ?? true}
              onChange={(e) =>
                setPreferences({ ...preferences, [x]: e.target.checked })
              }
            />
          </label>
        ),
      )}
      <Button>Save preferences</Button>
    </form>
  );
}
