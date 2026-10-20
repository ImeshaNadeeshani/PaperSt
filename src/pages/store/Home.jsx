import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { photos } from "../../data/products";
import { useShop } from "../../hooks/useShop";
import { SectionHeader } from "../../components/common/UI";
import {
  HeroBanner,
  ProductCollection,
  PromoBanner,
} from "../../components/layout/HomeSections";
import { TrustBadges } from "../../layouts/StoreLayout";
import DeliveryPartners from "../../components/layout/DeliveryPartners";
import { categoryArtworkStyle } from "../../data/artwork";

const collections = [
  {
    name: "Back to school",
    to: "/back-to-school",
    tile: 5,
    note: "Everything for a brighter year",
    items: [
      "School essentials",
      "Pens & pencils",
      "Bags & cases",
      "Lunch & bottles",
    ],
  },
  {
    name: "Office",
    to: "/category/office",
    tile: 4,
    note: "Tools for your next big idea",
    items: [
      "Pens & desk tools",
      "Files & folders",
      "Organisers",
      "Office essentials",
    ],
  },
  {
    name: "Paper",
    to: "/category/paper",
    tile: 7,
    note: "Every idea starts here",
    items: [
      "Everyday paper",
      "Coloured paper",
      "Craft paper",
      "Specialty paper",
    ],
  },
  {
    name: "Books",
    to: "/category/books",
    tile: 0,
    note: "A little space for possibility",
    items: [
      "Notebooks",
      "Journals & planners",
      "Sketchbooks",
      "Exercise books",
    ],
  },
  {
    name: "Accessories",
    to: "/category/accessories",
    tile: 3,
    note: "Small tools. Endless possibilities",
    items: [
      "Scissors & glue",
      "Clips & tape",
      "Rulers & cases",
      "Desk accessories",
    ],
  },
];

export default function Home() {
  const { products, content } = useShop();
  const config = (name) => content.find((x) => x.name === name) || {};
  const chosen = (name, flag) => {
    const ids = config(name)
      .productIds?.split(",")
      .map((x) => x.trim());
    return products
      .filter(
        (p) =>
          p.status === "Active" &&
          (ids?.length && ids[0] ? ids.includes(p.id) : p[flag]),
      )
      .slice(0, 4);
  };
  const header = (name, title, eyebrow, to = "/shop") => (
    <>
      <SectionHeader
        eyebrow={eyebrow}
        title={config(name).title || title}
        to={config(name).link || to}
        link={config(name).cta || "Explore all"}
      />
      {config(name).subtitle && (
        <p className="collection-description">{config(name).subtitle}</p>
      )}
    </>
  );
  const sections = {
    "Hero Banner": <HeroBanner config={config("Hero Banner")} />,
    "Category Section": (
      <>
        <section className="polaroid-section">
          {config("Category Section").title && (
            <h2>{config("Category Section").title}</h2>
          )}
          {config("Category Section").subtitle && (
            <p>{config("Category Section").subtitle}</p>
          )}
          <SectionHeader title="Our collection" to="/shop" link="Shop all" />
          <div className="collection-cards">
            {collections.map((collection) => (
              <Link
                className="collection-card"
                to={collection.to}
                key={collection.name}
              >
                <div
                  className="collection-card-art"
                  style={categoryArtworkStyle(collection.tile)}
                >
                  <h3>
                    {collection.name}
                    <span className="red-dot">.</span>
                  </h3>
                  <p>{collection.note}</p>
                </div>
                <ul>
                  {collection.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="collection-card-cta">
                  Shop{" "}
                  {collection.name === "Back to school"
                    ? "school"
                    : collection.name}{" "}
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </>
    ),
    "Featured Products": (
      <ProductCollection
        config={config("Featured Products")}
        title="Trending now"
        products={chosen("Featured Products", "featured")}
        to="/shop"
      />
    ),
    "Promotional Banners": (
      <PromoBanner config={config("Promotional Banners")} />
    ),
    "Back to School": (
      <PromoBanner config={config("Back to School")} kind="school" />
    ),
    Gifts: <PromoBanner config={config("Gifts")} kind="gifts" />,
    "Corporate Orders": (
      <PromoBanner config={config("Corporate Orders")} kind="corporate" />
    ),
    "New Arrivals": (
      <ProductCollection
        config={config("New Arrivals")}
        title="Just landed"
        eyebrow="FRESH PAGES, FRESH POSSIBILITIES"
        products={chosen("New Arrivals", "newArrival")}
        to="/new-arrivals"
      />
    ),
    "Best Sellers": (
      <ProductCollection
        config={config("Best Sellers")}
        title="Loved for a reason"
        eyebrow="THE ONES YOU KEEP COMING BACK TO"
        products={chosen("Best Sellers", "bestSeller")}
        to="/best-sellers"
      />
    ),
    "Paper Section": (
      <section className="section container paper-section">
        {header(
          "Paper Section",
          "It all starts with paper",
          "THE BEGINNING OF SOMETHING GOOD",
          "/category/paper",
        )}
        <div className="paper-grid">
          {[
            "Plain",
            "Ruled",
            "Grid",
            "Dot",
            "Kraft",
            "Sketch",
            "Watercolour",
            "Coloured",
          ].map((name, i) => (
            <Link to={`/shop?paper=${name}`} key={name}>
              <div className={`paper-sample paper-${i}`}>
                <span>p.</span>
              </div>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    "Social Gallery": (
      <section className="section container">
        {header(
          "Social Gallery",
          "#Paperist",
          "A LITTLE INSPIRATION FROM OUR COMMUNITY",
          "/blog",
        )}
        <div className="social-grid">
          {[photos.notebooks, photos.art, photos.desk, photos.journal].map(
            (image, i) => (
              <Link to={config("Social Gallery").link || "/blog"} key={i}>
                <img
                  src={config("Social Gallery").image || image}
                  alt={`Paperist creative inspiration ${i + 1}`}
                  loading="lazy"
                />
              </Link>
            ),
          )}
        </div>
      </section>
    ),
  };
  return (
    <div className="ink-home">
      {content
        .filter((x) => x.visible && x.name !== "Newsletter")
        .map((x) => (
          <div
            className={`home-section home-${x.name.toLowerCase().replaceAll(" ", "-")}`}
            data-section={x.name}
            key={x.name}
          >
            {sections[x.name]}
          </div>
        ))}
      <div className="ink-trust">
        <TrustBadges />
      </div>
      <div className="home-delivery-partners">
        <DeliveryPartners />
      </div>
    </div>
  );
}
