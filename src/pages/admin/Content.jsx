import BrandLogo from "../../components/common/BrandLogo";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { AdminHeading } from "../../components/common/AdminUI";
import { Button, Field, Modal } from "../../components/common/UI";
export default function Content() {
  const { content, setContent, notify } = useShop(),
    [editing, setEditing] = useState(null);
  const update = (index, value) =>
    setContent(content.map((x, i) => (i === index ? { ...x, ...value } : x)));
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= content.length) return;
    const next = [...content];
    [next[index], next[target]] = [next[target], next[index]];
    setContent(next);
    notify("Homepage sections reordered");
  };
  return (
    <>
      <AdminHeading
        title="A homepage that tells your story."
        description="Curate the moments your customers see first."
        action="View storefront"
        to="/"
      />
      <div className="cms-layout">
        <section className="panel">
          <div className="section-header">
            <h3>Homepage sections</h3>
            <span className="muted">
              {content.filter((x) => x.visible).length} visible
            </span>
          </div>
          <p className="demo-note">
            Visibility, order, and hero text update the storefront immediately
            on this device.
          </p>
          {content.map((section, i) => (
            <div
              className={`cms-row ${section.visible ? "" : "muted"}`}
              key={section.name}
            >
              <GripVertical size={17} />
              <span>
                <strong>{section.name}</strong>
                <small>
                  {section.visible ? "Visible on homepage" : "Hidden"}
                </small>
              </span>
              <div className="table-actions">
                <button
                  aria-label={`Move ${section.name} up`}
                  disabled={!i}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  aria-label={`Move ${section.name} down`}
                  disabled={i === content.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  aria-label={`Toggle ${section.name}`}
                  aria-pressed={section.visible}
                  onClick={() => update(i, { visible: !section.visible })}
                >
                  {section.visible ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
                <button
                  aria-label={`Edit ${section.name}`}
                  onClick={() => setEditing({ ...section, index: i })}
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
          ))}
        </section>
        <aside>
          <section className="panel cms-preview">
            <span className="eyebrow">YOUR STOREFRONT</span>
            <div className="mini-logo">
              <BrandLogo />
            </div>
            <img
              src={
                content.find((x) => x.name === "Hero Banner")?.image ||
                "/images/paperist-hero.png"
              }
              alt="Homepage hero preview"
            />
            <h2>
              {content.find((x) => x.name === "Hero Banner")?.title ||
                "Good ideas start here."}
            </h2>
            <p>
              {content.find((x) => x.name === "Hero Banner")?.subtitle ||
                "Stationery for ideas worth keeping."}
            </p>
            <Link className="text-link" to="/">
              Open live preview <ExternalLink size={15} />
            </Link>
          </section>
          <section className="panel">
            <h3>A little editorial care.</h3>
            <p>
              Keep your message clear, your images thoughtful, and your
              favourite products easy to discover.
            </p>
          </section>
        </aside>
      </div>
      {editing && (
        <Modal title={"Edit " + editing.name} onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update(editing.index, editing);
              setEditing(null);
              notify("Section content saved");
            }}
          >
            <Field
              label="Heading"
              value={editing.title || ""}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />
            <Field
              label="Subtitle"
              type="textarea"
              value={editing.subtitle || ""}
              onChange={(e) =>
                setEditing({ ...editing, subtitle: e.target.value })
              }
            />
            <Field
              label="CTA text"
              value={editing.cta || ""}
              onChange={(e) => setEditing({ ...editing, cta: e.target.value })}
            />
            <Field
              label="CTA link"
              value={editing.link || "/shop"}
              onChange={(e) => setEditing({ ...editing, link: e.target.value })}
            />
            <Field
              label="Image URL"
              type="url"
              value={editing.image || ""}
              onChange={(e) =>
                setEditing({ ...editing, image: e.target.value })
              }
            />
            {["Featured Products", "Best Sellers", "New Arrivals"].includes(
              editing.name,
            ) && (
              <Field
                label="Product IDs (comma separated)"
                placeholder="1, 2, 3, 4"
                value={editing.productIds || ""}
                onChange={(e) =>
                  setEditing({ ...editing, productIds: e.target.value })
                }
              />
            )}
            <Button>Save section</Button>
          </form>
        </Modal>
      )}
    </>
  );
}
