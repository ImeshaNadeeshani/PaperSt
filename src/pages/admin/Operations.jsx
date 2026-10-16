import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../../hooks/useShop";
import { customers } from "../../data/customers";
import { money } from "../../data/products";
import { AdminHeading, Table } from "../../components/common/AdminUI";
import {
  Button,
  Field,
  Modal,
  Status,
  EmptyState,
} from "../../components/common/UI";
import { OrderTable } from "../account/AccountPages";
import useLocalStorage from "../../hooks/useLocalStorage";
export function Inventory() {
  const { products, setProducts, notify } = useShop(),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [editing, setEditing] = useState(null),
    [history, setHistory] = useLocalStorage("paperist-stock-history", []),
    [showHistory, setShowHistory] = useState(false);
  const stockStatus = (p) =>
    p.stock === 0 ? "Out of stock" : p.stock < 12 ? "Low stock" : "In stock";
  return (
    <>
      <AdminHeading
        title="Inventory"
        description="Keep the good ideas in stock."
        action="Stock history"
        onClick={() => setShowHistory(true)}
      />
      <section className="panel">
        <div className="admin-filters">
          <input
            aria-label="Search inventory"
            placeholder="Search name or SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Stock filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", "In stock", "Low stock", "Out of stock"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <Table
          columns={[
            "Product",
            "SKU",
            "Variant",
            "Current",
            "Reserved",
            "Available",
            "Status",
            "",
          ]}
          rows={products.filter(
            (p) =>
              (p.name + p.SKU).toLowerCase().includes(query.toLowerCase()) &&
              (filter === "All" || stockStatus(p) === filter),
          )}
          render={(p) => (
            <>
              <td>{p.name}</td>
              <td>{p.SKU}</td>
              <td>
                {p.variants.Size[0]} / {p.variants.Colour[0]}
              </td>
              <td>{p.stock}</td>
              <td>0</td>
              <td>{p.stock}</td>
              <td>
                <Status>{stockStatus(p)}</Status>
              </td>
              <td>
                <button className="text-link" onClick={() => setEditing(p)}>
                  Adjust / add stock
                </button>
              </td>
            </>
          )}
        />
      </section>
      {editing && (
        <Modal title="Adjust inventory" onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target),
                amount = Number(data.get("stock"));
              setProducts(
                products.map((x) =>
                  x.id === editing.id ? { ...x, stock: amount } : x,
                ),
              );
              setHistory([
                {
                  id: String(Date.now()),
                  name: editing.name,
                  before: editing.stock,
                  after: amount,
                  reason: data.get("reason"),
                  date: new Date().toLocaleString("en-GB"),
                },
                ...history,
              ]);
              notify("Inventory updated");
              setEditing(null);
            }}
          >
            <p>
              {editing.name} · Current: {editing.stock}
            </p>
            <Field
              label="New stock quantity"
              type="number"
              min="0"
              step="1"
              name="stock"
              defaultValue={editing.stock}
              required
            />
            <Field
              label="Reason"
              name="reason"
              required
              placeholder="New delivery, correction…"
            />
            <Button>Save adjustment</Button>
          </form>
        </Modal>
      )}
      {showHistory && (
        <Modal title="Stock history" onClose={() => setShowHistory(false)}>
          {history.length ? (
            history.map((x) => (
              <p key={x.id}>
                <strong>{x.name}</strong>
                <br />
                {x.before} → {x.after} · {x.reason}
                <br />
                <small>{x.date}</small>
              </p>
            ))
          ) : (
            <p>No adjustments yet.</p>
          )}
        </Modal>
      )}
    </>
  );
}
export function AdminOrders() {
  const { orders } = useShop(),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("All");
  return (
    <>
      <AdminHeading
        title="Orders"
        description="From a good idea to a happy doorstep."
      />
      <section className="panel">
        <div className="admin-filters">
          <input
            aria-label="Search orders"
            placeholder="Order number or customer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Order status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {[
              "All",
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
        </div>
        <OrderTable
          admin
          orders={orders.filter(
            (o) =>
              (o.id + o.customer).toLowerCase().includes(query.toLowerCase()) &&
              (status === "All" || o.status === status),
          )}
        />
      </section>
    </>
  );
}
export function Customers() {
  const [query, setQuery] = useState("");
  return (
    <>
      <AdminHeading
        title="Customers"
        description="The people behind every good idea."
      />
      <section className="panel">
        <div className="admin-filters">
          <input
            aria-label="Search customers"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table
          columns={[
            "Name",
            "Email",
            "Phone",
            "Orders",
            "Total spend",
            "Joined",
            "Status",
            "",
          ]}
          rows={customers.filter((x) =>
            (x.name + x.email).toLowerCase().includes(query.toLowerCase()),
          )}
          render={(c) => (
            <>
              <td>
                <Link className="text-link" to={"/admin/customers/" + c.id}>
                  {c.name}
                </Link>
              </td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.orders}</td>
              <td>{money(c.spend)}</td>
              <td>{c.joined}</td>
              <td>
                <Status>{c.status}</Status>
              </td>
              <td>
                <Link to={"/admin/customers/" + c.id}>View ↗</Link>
              </td>
            </>
          )}
        />
      </section>
    </>
  );
}
export function CustomerDetails() {
  const { id } = useParams(),
    { orders, notify } = useShop(),
    [notes, setNotes] = useLocalStorage("paperist-customer-notes", {}),
    [text, setText] = useState("");
  const c = customers.find((x) => x.id === id);
  if (!c) return <EmptyState title="Customer not found" />;
  return (
    <>
      <AdminHeading title={c.name} description={c.email} />
      <div className="stat-grid">
        {[
          ["Orders", c.orders],
          ["Lifetime spend", money(c.spend)],
          ["Member since", c.joined],
        ].map(([title, value]) => (
          <section className="panel stat" key={title}>
            <span>{title}</span>
            <strong>{value}</strong>
          </section>
        ))}
      </div>
      <div className="two-columns">
        <section className="panel">
          <h3>Profile & addresses</h3>
          <p>
            {c.email}
            <br />
            {c.phone}
          </p>
          <p>
            24 Flower Road, Colombo 07
            <br />
            Sri Lanka
          </p>
          <Status>{c.status}</Status>
        </section>
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setNotes({ ...notes, [id]: [...(notes[id] || []), text] });
            setText("");
            notify("Customer note saved");
          }}
        >
          <h3>Notes</h3>
          {notes[id]?.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
          <Field
            label="Add a note"
            type="textarea"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button>Save note</Button>
        </form>
      </div>
      <section className="panel">
        <h3>Order history</h3>
        <OrderTable admin orders={orders.filter((x) => x.email === c.email)} />
      </section>
    </>
  );
}
const rfqSeed = [
  {
    id: "RFQ-204",
    "Company name": "Studio North",
    "Contact person": "Dilan Jay",
    Email: "dilan@example.com",
    Phone: "077 456 7890",
    Product: "Branded notebooks",
    "Estimated quantity": 100,
    "Branding required": "Yes",
    "Required date": "2026-11-01",
    Message: "A welcome kit for our new team.",
    status: "New",
    date: "2026-10-04",
  },
];
export function RFQs() {
  const [rfqs, setRfqs] = useLocalStorage("paperist-rfqs", rfqSeed),
    [filter, setFilter] = useState("All");
  const statuses = [
    "New",
    "Reviewing",
    "Quoted",
    "Accepted",
    "Completed",
    "Rejected",
  ];
  return (
    <>
      <AdminHeading
        title="Corporate requests"
        description="Bigger ideas start with a conversation."
      />
      <section className="panel">
        <div className="admin-filters">
          <select
            aria-label="RFQ filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All", ...statuses].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <Table
          columns={[
            "Request",
            "Company",
            "Product",
            "Quantity",
            "Date",
            "Status",
            "",
          ]}
          rows={rfqs.filter((x) => filter === "All" || x.status === filter)}
          render={(r) => (
            <>
              <td>
                <Link to={"/admin/corporate-orders/" + r.id}>{r.id}</Link>
              </td>
              <td>{r["Company name"]}</td>
              <td>{r.Product}</td>
              <td>{r["Estimated quantity"]}</td>
              <td>{r.date}</td>
              <td>
                <select
                  aria-label={`Status for ${r.id}`}
                  value={r.status}
                  onChange={(e) =>
                    setRfqs(
                      rfqs.map((x) =>
                        x.id === r.id ? { ...x, status: e.target.value } : x,
                      ),
                    )
                  }
                >
                  {statuses.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </td>
              <td>
                <Link to={"/admin/corporate-orders/" + r.id}>View ↗</Link>
              </td>
            </>
          )}
        />
      </section>
    </>
  );
}
export function RFQDetails() {
  const { id } = useParams(),
    [rfqs, setRfqs] = useLocalStorage("paperist-rfqs", rfqSeed),
    { notify } = useShop();
  const r = rfqs.find((x) => x.id === id);
  if (!r) return <EmptyState title="Request not found" />;
  return (
    <>
      <AdminHeading
        title={r["Company name"]}
        description={"Quote request " + id}
      />
      <section className="panel">
        <dl className="specs">
          {Object.entries(r)
            .filter(([key]) => key !== "status")
            .map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
        </dl>
        <Field
          label="Request status"
          value={r.status}
          options={[
            "New",
            "Reviewing",
            "Quoted",
            "Accepted",
            "Completed",
            "Rejected",
          ]}
          onChange={(e) => {
            setRfqs(
              rfqs.map((x) =>
                x.id === id ? { ...x, status: e.target.value } : x,
              ),
            );
            notify("Request status updated");
          }}
        />
      </section>
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.target);
          setRfqs(
            rfqs.map((x) =>
              x.id === id
                ? {
                    ...x,
                    quote: data.get("quote"),
                    notes: data.get("notes"),
                    status: "Quoted",
                  }
                : x,
            ),
          );
          notify("Demo quote saved");
        }}
      >
        <Field
          label="Quote amount (Rs.)"
          type="number"
          min="0"
          name="quote"
          defaultValue={r.quote}
          required
        />
        <Field
          label="Internal notes"
          type="textarea"
          name="notes"
          defaultValue={r.notes}
        />
        <Button>Save quote</Button>
      </form>
    </>
  );
}
