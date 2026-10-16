import { useState } from "react";
import {
  useSearchParams,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Copy,
  Archive,
  Eye,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { categories, money, slugify, photos } from "../../data/products";
import { AdminHeading, Table } from "../../components/common/AdminUI";
import {
  Button,
  Status,
  Field,
  EmptyState,
  Modal,
} from "../../components/common/UI";
export function AdminProducts() {
  const { products, setProducts, notify } = useShop(),
    [params] = useSearchParams(),
    [query, setQuery] = useState(params.get("q") || ""),
    [category, setCategory] = useState(""),
    [status, setStatus] = useState(""),
    [sort, setSort] = useState("Name"),
    [page, setPage] = useState(1);
  const rows = products
    .filter(
      (p) =>
        (p.name + " " + p.SKU).toLowerCase().includes(query.toLowerCase()) &&
        (!category || p.category === category) &&
        (!status || p.status === status),
    )
    .sort((a, b) =>
      sort === "Price" ? a.price - b.price : a.name.localeCompare(b.name),
    );
  return (
    <>
      <AdminHeading
        title="Products"
        description="A thoughtfully curated catalogue, all in one place."
        action="Add product"
        to="/admin/products/new"
      />
      <section className="panel">
        <div className="admin-filters">
          <div className="input-icon">
            <Search size={17} />
            <input
              aria-label="Search catalogue"
              placeholder="Search products or SKU…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            aria-label="Filter category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {["Active", "Draft", "Archived"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option>Name</option>
            <option>Price</option>
          </select>
        </div>
        <Table
          columns={[
            "Product",
            "SKU",
            "Category",
            "Brand",
            "Price",
            "Stock",
            "Status",
            "Actions",
          ]}
          rows={rows.slice((page - 1) * 10, page * 10)}
          render={(p) => (
            <>
              <td>
                <div className="table-product">
                  <img src={p.images[0]} alt={p.name} />
                  <Link to={"/admin/products/" + p.id + "/edit"}>{p.name}</Link>
                </div>
              </td>
              <td>{p.SKU}</td>
              <td>{p.category}</td>
              <td>{p.brand}</td>
              <td>{money(p.salePrice ?? p.price)}</td>
              <td>{p.stock}</td>
              <td>
                <Status>{p.status}</Status>
              </td>
              <td>
                <div className="table-actions">
                  <Link
                    title="Edit"
                    aria-label={`Edit ${p.name}`}
                    to={"/admin/products/" + p.id + "/edit"}
                  >
                    <Edit size={15} />
                  </Link>
                  <Link
                    title="View"
                    aria-label={`View ${p.name}`}
                    to={"/product/" + p.slug}
                  >
                    <Eye size={15} />
                  </Link>
                  <button
                    title="Duplicate"
                    aria-label={`Duplicate ${p.name}`}
                    onClick={() => {
                      const id = String(Date.now());
                      setProducts([
                        ...products,
                        {
                          ...p,
                          id,
                          name: p.name + " (copy)",
                          slug: p.slug + "-" + id,
                          SKU: p.SKU + "-COPY",
                          status: "Draft",
                        },
                      ]);
                      notify("Draft copy created");
                    }}
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    title="Archive"
                    aria-label={`Archive ${p.name}`}
                    onClick={() => {
                      setProducts(
                        products.map((x) =>
                          x.id === p.id ? { ...x, status: "Archived" } : x,
                        ),
                      );
                      notify("Product archived");
                    }}
                  >
                    <Archive size={15} />
                  </button>
                </div>
              </td>
            </>
          )}
        />
        <div className="table-footer">
          <span>{rows.length} products</span>
          <div className="pagination">
            {Array.from({ length: Math.ceil(rows.length / 10) }, (_, i) => (
              <button
                className={page === i + 1 ? "selected" : ""}
                onClick={() => setPage(i + 1)}
                key={i}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function ProductForm() {
  const { id } = useParams(),
    navigate = useNavigate(),
    { products, setProducts, notify } = useShop();
  const existing = products.find((x) => x.id === id);
  const [form, setForm] = useState(
      existing || {
        name: "",
        SKU: "",
        description: "",
        category: "Notebooks",
        subcategory: "Everyday essentials",
        brand: "Paperist",
        price: 690,
        salePrice: "",
        stock: 10,
        images: [],
        variants: {
          Size: ["A5"],
          Colour: ["Natural"],
          "Paper Type": ["Ruled"],
        },
      },
    ),
    [media, setMedia] = useState(""),
    [preview, setPreview] = useState(false),
    [variants, setVariants] = useState(
      existing?.variantRows || [
        {
          size: "A5",
          paper: "Ruled",
          colour: "Natural",
          price: existing?.price || 690,
          stock: existing?.stock ?? 10,
        },
      ],
    );
  if (id && !existing) return <EmptyState title="Product not found" />;
  const update = (key, value) => setForm({ ...form, [key]: value });
  const save = (status) => {
    const product = {
      ...form,
      id: existing?.id || String(Date.now()),
      slug: form.slug || slugify(form.name),
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      images: form.images.length ? form.images : [photos.notebooks],
      rating: existing?.rating || 4.8,
      reviewCount: existing?.reviewCount || 0,
      featured: existing?.featured || false,
      bestSeller: existing?.bestSeller || false,
      newArrival: existing?.newArrival ?? true,
      status,
      variants: {
        Size: [...new Set(variants.map((x) => x.size))],
        Colour: [...new Set(variants.map((x) => x.colour))],
        "Paper Type": [...new Set(variants.map((x) => x.paper))],
      },
      variantRows: variants,
    };
    if (
      products.some(
        (x) =>
          x.id !== product.id &&
          (x.slug === product.slug || x.SKU === product.SKU),
      )
    ) {
      notify("SKU and URL slug must be unique.");
      return;
    }
    setProducts(
      existing
        ? products.map((x) => (x.id === id ? product : x))
        : [...products, product],
    );
    notify(status === "Draft" ? "Draft saved" : "Product published");
    navigate("/admin/products");
  };
  const upload = (files) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () =>
        setForm((old) => ({ ...old, images: [...old.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(e.nativeEvent.submitter?.value || "Active");
      }}
    >
      <AdminHeading
        title={id ? "Edit product" : "A new addition"}
        description="Give your next favourite a little home in the catalogue."
      />
      <div className="product-form-layout">
        <div>
          <section className="panel">
            <h3>Basic information</h3>
            <Field
              label="Product name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <Field
              label="Short description"
              value={form.shortDescription || ""}
              onChange={(e) => update("shortDescription", e.target.value)}
            />
            <Field
              label="Full description"
              type="textarea"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
            <div className="form-grid">
              <Field
                label="SKU"
                required
                value={form.SKU}
                onChange={(e) => update("SKU", e.target.value)}
              />
              <Field
                label="Barcode"
                value={form.barcode || ""}
                onChange={(e) => update("barcode", e.target.value)}
              />
            </div>
          </section>
          <section className="panel">
            <h3>Media</h3>
            <label
              className="upload-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                upload(e.dataTransfer.files);
              }}
            >
              <UploadCloud />
              <strong>Drop images here, or browse</strong>
              <small>First image is the main image · PNG, JPG, WEBP</small>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => upload(e.target.files)}
              />
            </label>
            <div className="thumbnails">
              {form.images.map((x, i) => (
                <div key={i}>
                  <img src={x} alt={`Product media ${i + 1}`} />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() =>
                      update(
                        "images",
                        form.images.filter((_, j) => i !== j),
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="promo-form">
              <input
                aria-label="Image URL"
                placeholder="Or paste an image URL"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  if (/^https?:\/\//.test(media)) {
                    update("images", [...form.images, media]);
                    setMedia("");
                  } else notify("Enter a valid https image URL");
                }}
              >
                Add image
              </button>
            </div>
          </section>
          <section className="panel">
            <div className="section-header">
              <h3>Variants</h3>
              <button
                type="button"
                className="text-link"
                onClick={() =>
                  setVariants([
                    ...variants,
                    {
                      size: "A4",
                      paper: "Plain",
                      colour: "Navy",
                      price: 690,
                      stock: 10,
                    },
                  ])
                }
              >
                <Plus size={15} />
                Add variant
              </button>
            </div>
            {variants.map((row, i) => (
              <div className="variant-fields" key={i}>
                {Object.entries(row).map(([key, value]) => (
                  <Field
                    key={key}
                    label={key}
                    value={value}
                    type={["price", "stock"].includes(key) ? "number" : "text"}
                    min="0"
                    required
                    onChange={(e) =>
                      setVariants(
                        variants.map((x, j) =>
                          j === i ? { ...x, [key]: e.target.value } : x,
                        ),
                      )
                    }
                  />
                ))}
                <button
                  type="button"
                  aria-label="Remove variant"
                  disabled={variants.length === 1}
                  onClick={() =>
                    setVariants(variants.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </section>
          <section className="panel">
            <h3>Search engine listing</h3>
            <Field
              label="SEO title"
              value={form.seoTitle || ""}
              onChange={(e) => update("seoTitle", e.target.value)}
            />
            <Field
              label="Meta description"
              type="textarea"
              value={form.metaDescription || ""}
              onChange={(e) => update("metaDescription", e.target.value)}
            />
            <Field
              label="URL slug"
              value={form.slug || ""}
              placeholder={slugify(form.name)}
              pattern="[a-z0-9-]+"
              onChange={(e) => update("slug", e.target.value)}
            />
          </section>
        </div>
        <div>
          <section className="panel">
            <h3>Organisation</h3>
            <Field
              label="Category"
              options={categories}
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            />
            {[
              ["Subcategory", "subcategory"],
              ["Brand", "brand"],
              ["Tags", "tags"],
            ].map(([label, key]) => (
              <Field
                key={key}
                label={label}
                value={form[key] || ""}
                onChange={(e) => update(key, e.target.value)}
              />
            ))}
          </section>
          <section className="panel">
            <h3>Pricing · LKR</h3>
            {[
              ["Cost price", "costPrice"],
              ["Regular price", "price"],
              ["Sale price", "salePrice"],
            ].map(([label, key]) => (
              <Field
                key={key}
                label={label}
                type="number"
                min="0"
                value={form[key] ?? ""}
                required={key === "price"}
                onChange={(e) => update(key, e.target.value)}
              />
            ))}
          </section>
          <section className="panel">
            <h3>Inventory</h3>
            <Field
              label="Stock"
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
            <Field
              label="Low stock threshold"
              type="number"
              min="0"
              value={form.threshold || 5}
              onChange={(e) => update("threshold", e.target.value)}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={form.backorders || false}
                onChange={(e) => update("backorders", e.target.checked)}
              />{" "}
              Allow backorders
            </label>
          </section>
          <section className="panel">
            <h3>Ready when you are</h3>
            <div className="stack">
              <Button type="submit" value="Active">
                Publish product ↗
              </Button>
              <Button secondary type="submit" value="Draft">
                Save draft
              </Button>
              <Button secondary type="button" onClick={() => setPreview(true)}>
                Preview product
              </Button>
              <Link to="/admin/products">Cancel</Link>
            </div>
          </section>
        </div>
      </div>
      {preview && (
        <Modal title="Product preview" onClose={() => setPreview(false)}>
          <div className="two-columns">
            <img
              src={form.images[0] || photos.notebooks}
              alt={form.name || "Product preview"}
              style={{ aspectRatio: "1", width: "100%" }}
            />
            <div>
              <span className="eyebrow">{form.brand}</span>
              <h2>{form.name || "Your new product"}</h2>
              <p>
                {form.description ||
                  "Add a description to bring this product to life."}
              </p>
              <strong>{money(form.salePrice || form.price)}</strong>
              <p>
                {form.stock} in stock · {form.category}
              </p>
              <p className="muted">
                Preview of your current form. Save or publish to update the
                catalogue.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
}
