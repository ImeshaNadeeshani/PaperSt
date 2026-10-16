import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { categories } from "../../data/products";
import { useShop } from "../../hooks/useShop";
import useLocalStorage from "../../hooks/useLocalStorage";
import { AdminHeading, Table } from "../../components/common/AdminUI";
import { Button, Field, Modal, Status } from "../../components/common/UI";
const schemas = {
  categories: {
    title: "Categories",
    description: "A place for every kind of idea.",
    fields: [
      ["Name"],
      ["Parent category", "select", ["None", ...categories]],
      ["Subcategory"],
      ["Image URL", "url"],
      ["Banner URL", "url"],
      ["Description", "textarea"],
    ],
    seed: categories.map((x, i) => ({
      id: String(i),
      Name: x,
      "Parent category": "None",
      status: "Active",
    })),
  },
  brands: {
    title: "Brands",
    description: "Good makers, thoughtfully collected.",
    fields: [
      ["Name"],
      ["Description", "textarea"],
      ["Logo URL", "url"],
      ["Website", "url"],
    ],
    seed: ["Kokuyo", "MUJI", "Stabilo", "Paperist", "Midori", "Sakura"].map(
      (x, i) => ({ id: String(i), Name: x, status: "Active" }),
    ),
  },
  coupons: {
    title: "Coupons",
    description: "A little extra reason to create.",
    fields: [
      ["Coupon code"],
      ["Type", "select", ["Percentage", "Fixed"]],
      ["Discount value", "number"],
      ["Minimum spend", "number"],
      ["Maximum uses", "number"],
      ["Start date", "date"],
      ["End date", "date"],
      ["Applicable categories", "select", ["All", ...categories]],
      ["Applicable products"],
      ["Status", "select", ["Active", "Draft", "Expired"]],
    ],
    seed: [
      {
        id: "1",
        "Coupon code": "PAPER10",
        Type: "Percentage",
        "Discount value": 10,
        "Minimum spend": 0,
        "Maximum uses": 100,
        Status: "Active",
      },
    ],
  },
  banners: {
    title: "Banners",
    description: "Set the scene for your next campaign.",
    fields: [
      ["Campaign name"],
      ["Desktop image", "url"],
      ["Mobile image", "url"],
      ["Title"],
      ["Subtitle"],
      ["CTA text"],
      ["CTA link"],
      ["Start date", "date"],
      ["End date", "date"],
      ["Status", "select", ["Active", "Draft", "Scheduled", "Expired"]],
    ],
    seed: [
      {
        id: "1",
        "Campaign name": "Everyday collection",
        Title: "Good ideas start here.",
        "CTA text": "Shop now",
        "CTA link": "/shop",
        Status: "Active",
      },
    ],
  },
  users: {
    title: "Users & roles",
    description: "The right access for every member of your team.",
    fields: [
      ["Name"],
      ["Email", "email"],
      [
        "Role",
        "select",
        [
          "Super Admin",
          "Store Manager",
          "Inventory Manager",
          "Order Staff",
          "Marketing",
          "Finance",
        ],
      ],
      ["Status", "select", ["Active", "Invited", "Disabled"]],
    ],
    seed: [
      {
        id: "1",
        Name: "Amaya Perera",
        Email: "amaya@example.com",
        Role: "Super Admin",
        Status: "Active",
      },
      {
        id: "2",
        Name: "Dilan Jay",
        Email: "dilan@example.com",
        Role: "Inventory Manager",
        Status: "Active",
      },
    ],
  },
};
export default function Management() {
  const key = useLocation().pathname.split("/")[2],
    schema = schemas[key],
    { notify } = useShop();
  const [rows, setRows] = useLocalStorage(
      "paperist-manage-" + key,
      schema.seed,
    ),
    [editing, setEditing] = useState(null),
    [query, setQuery] = useState(""),
    [permissions, setPermissions] = useLocalStorage("paperist-permissions", {});
  const titleField = schema.fields[0][0];
  const move = (index, delta) => {
    const next = [...rows],
      target = index + delta;
    if (target < 0 || target >= rows.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  };
  return (
    <>
      <AdminHeading
        title={schema.title}
        description={schema.description}
        action={
          "Add " +
          (key === "categories"
            ? "category"
            : key === "users"
              ? "team member"
              : key.slice(0, -1))
        }
        onClick={() => setEditing({})}
      />
      <section className="panel">
        <div className="admin-filters">
          <input
            aria-label={`Search ${schema.title}`}
            placeholder={`Search ${schema.title.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table
          columns={[
            ...schema.fields.slice(0, 4).map((x) => x[0]),
            "Status",
            "Actions",
          ]}
          rows={rows.filter((x) =>
            String(x[titleField]).toLowerCase().includes(query.toLowerCase()),
          )}
          render={(r) => (
            <>
              {schema.fields.slice(0, 4).map(([field]) => (
                <td key={field}>{r[field] || "—"}</td>
              ))}
              <td>
                <Status>{r.Status || r.status || "Active"}</Status>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    aria-label={`Edit ${r[titleField]}`}
                    onClick={() => setEditing(r)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${r[titleField]}`}
                    onClick={() => {
                      setRows(rows.filter((x) => x.id !== r.id));
                      notify("Record removed from local demo");
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                  {key === "categories" && (
                    <>
                      <button
                        aria-label="Move category up"
                        onClick={() =>
                          move(
                            rows.findIndex((x) => x.id === r.id),
                            -1,
                          )
                        }
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        aria-label="Move category down"
                        onClick={() =>
                          move(
                            rows.findIndex((x) => x.id === r.id),
                            1,
                          )
                        }
                      >
                        <ArrowDown size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </>
          )}
        />
      </section>
      {key === "users" && (
        <section className="panel">
          <h3>Role permissions</h3>
          <p className="muted">
            Mock permissions only. Server enforcement will be added in Phase 2.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  {[
                    "Products",
                    "Orders",
                    "Inventory",
                    "Content",
                    "Reports",
                    "Settings",
                  ].map((x) => (
                    <th key={x}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Super Admin",
                  "Store Manager",
                  "Inventory Manager",
                  "Order Staff",
                  "Marketing",
                  "Finance",
                ].map((role) => (
                  <tr key={role}>
                    <td>{role}</td>
                    {[
                      "Products",
                      "Orders",
                      "Inventory",
                      "Content",
                      "Reports",
                      "Settings",
                    ].map((area) => (
                      <td key={area}>
                        <input
                          type="checkbox"
                          aria-label={`${role} ${area} permission`}
                          checked={
                            permissions[role + area] ??
                            (role === "Super Admin" || role === "Store Manager")
                          }
                          onChange={(e) =>
                            setPermissions({
                              ...permissions,
                              [role + area]: e.target.checked,
                            })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {editing && (
        <Modal
          title={(editing.id ? "Edit " : "Add ") + schema.title.toLowerCase()}
          onClose={() => setEditing(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.target));
              const saved = {
                ...editing,
                ...data,
                id: editing.id || String(Date.now()),
              };
              setRows(
                editing.id
                  ? rows.map((x) => (x.id === editing.id ? saved : x))
                  : [...rows, saved],
              );
              setEditing(null);
              notify("Saved to local demo");
            }}
          >
            <div className="form-grid">
              {schema.fields.map(([label, type = "text", options], i) => (
                <Field
                  key={label}
                  label={label}
                  name={label}
                  type={type}
                  options={type === "select" ? options : undefined}
                  defaultValue={editing[label] || ""}
                  min={type === "number" ? 0 : undefined}
                  required={i === 0}
                />
              ))}
            </div>
            <Button>Save changes</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Reviews() {
  const { notify } = useShop(),
    [rows, setRows] = useLocalStorage("paperist-reviews", [
      {
        id: "1",
        customer: "Amaya Perera",
        product: "Kokuyo Campus Notebook",
        rating: 5,
        review: "Lovely paper and a beautiful cover. My everyday favourite.",
        status: "Pending",
      },
      {
        id: "2",
        customer: "Kavindi Silva",
        product: "Sakura Watercolour Set",
        rating: 4,
        review: "Beautiful colours. Perfect for a little creative time.",
        status: "Approved",
      },
    ]),
    [reply, setReply] = useState(null);
  return (
    <>
      <AdminHeading
        title="Reviews"
        description="A little feedback goes a long way."
      />
      <div className="two-columns">
        {rows.map((r) => (
          <section className="panel" key={r.id}>
            <div className="section-header">
              <h3>{r.product}</h3>
              <Status>{r.status}</Status>
            </div>
            <p>
              {"★".repeat(r.rating)} · {r.customer}
            </p>
            <p>“{r.review}”</p>
            {r.reply && <p className="demo-note">Paperist: {r.reply}</p>}
            <div className="button-row">
              {["Approved", "Rejected", "Flagged"].map((status) => (
                <button
                  className="text-link"
                  key={status}
                  onClick={() =>
                    setRows(
                      rows.map((x) => (x.id === r.id ? { ...x, status } : x)),
                    )
                  }
                >
                  {status === "Approved"
                    ? "Approve"
                    : status === "Rejected"
                      ? "Reject"
                      : "Flag"}
                </button>
              ))}
              <button className="text-link" onClick={() => setReply(r)}>
                Reply
              </button>
              <button
                className="text-link red"
                onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
              >
                Delete
              </button>
            </div>
          </section>
        ))}
      </div>
      {reply && (
        <Modal title="Reply to review" onClose={() => setReply(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = new FormData(e.target).get("reply");
              setRows(
                rows.map((x) =>
                  x.id === reply.id ? { ...x, reply: text } : x,
                ),
              );
              setReply(null);
              notify("Reply saved");
            }}
          >
            <Field label="Your reply" name="reply" type="textarea" required />
            <Button>Save reply</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
