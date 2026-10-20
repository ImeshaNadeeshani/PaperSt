import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button, SectionHeader } from "../common/UI";
import { ProductGrid } from "../product/ProductCard";
import { slugify } from "../../data/products";
import { categoryArtworkStyle } from "../../data/artwork";

export function HeroBanner({ config = {} }) {
  return (
    <section className="hero ink-hero">
      <div className="hero-copy">
        <h1>
          {config.title || (
            <>
              <span className="hero-title-main">Good<br />ideas</span>
              <span className="hero-title-script">start here<span className="ink-dot">.</span></span>
            </>
          )}
        </h1>
        <p>
          {config.subtitle || "Stationery for ideas worth keeping."}
          <span className="tiny-dot" />
        </p>
        <Button to={config.link || "/shop"}>
          {config.cta || "Shop now"}
          <ArrowRight size={18} />
        </Button>
        <span className="ink-brush" aria-hidden="true" />
      </div>
      <div className="ink-hero-art">
        <img
          className="hero-background"
          src={config.image || "/images/paperist-hero.png"}
          alt="Sunlit illustration of a girl daydreaming at a stationery desk beside a cat"
          fetchPriority="high"
        />
        <div className="hero-memo memo-left">
          Write.
          <br />
          Plan.
          <br />
          Create.
          <br />
          Organise.
          <br />
          Repeat.
        </div>
        <div className="hero-memo memo-right">
          Same paper.
          <br />
          Brighter ideas<span className="red-dot">.</span>
        </div>
        <span className="art-edition">
          A LITTLE EVERYDAY INSPIRATION / VOL. 01
        </span>
      </div>
      <aside className="hero-margin" aria-hidden="true">
        <span className="vertical-note">WRITE. CREATE. DREAM. REPEAT.</span>
        <span>
          Better
          <br />
          ideas.
          <br />
          Brighter
          <br />
          days<span className="red-dot">.</span>
        </span>
      </aside>
    </section>
  );
}

const labels = [
  "ノート",
  "ペン",
  "手帳",
  "アート",
  "デスク",
  "スクール",
  "ギフト",
  "ブランド",
];
export function CategoryCard({ name, image, index = 0 }) {
  return (
    <Link
      className="category-card polaroid"
      to={name === "Brands" ? "/brands" : `/category/${slugify(name)}`}
    >
      <div
        className="category-photo"
        role="img"
        aria-label={name}
        style={
          image
            ? { backgroundImage: `url("${image}")`, backgroundSize: "cover" }
            : categoryArtworkStyle(index)
        }
      />
      <strong>{name}</strong>
      <small aria-hidden="true">{labels[index]}</small>
    </Link>
  );
}

export function ProductCollection({
  config = {},
  title,
  eyebrow,
  products,
  to,
}) {
  return (
    <section className="section container">
      <SectionHeader
        eyebrow={eyebrow}
        title={config.title || title}
        to={config.link || to}
        link={config.cta || "Explore all"}
      />
      {config.subtitle && (
        <p className="collection-description">{config.subtitle}</p>
      )}
      <ProductGrid products={products} illustrated />
    </section>
  );
}

export function BudgetBanner() {
  return (
    <section className="budget-banner">
      <div
        className="budget-manga"
        role="img"
        aria-label="Manga illustration of a girl reading a notebook"
      >
        <span className="speech-bubble">
          A little
          <br />
          good idea!
        </span>
      </div>
      <div className="budget-copy">
        <h2>
          Small things.
          <br />
          Big ideas<span className="red-dot">.</span>
        </h2>
        <span>SHOP UNDER</span>
        <div className="budget-links">
          {[500, 1000, 2500].map((n) => (
            <Link key={n} to={`/shop?max=${n}`}>
              Rs. {n.toLocaleString()}
            </Link>
          ))}
          <ArrowRight size={18} />
        </div>
      </div>
      <div className="budget-collage">
        <span className="pencil-decoration" aria-hidden="true" />
        <div className="pinned-note">
          Good
          <br />
          people.
          <br />
          Good
          <br />
          ideas<span className="red-dot">.</span>
        </div>
        <span className="collage-mantra">
          Study.
          <br />
          Create.
          <br />
          Work.
          <br />
          Dream.
          <br />
          Repeat.
        </span>
      </div>
    </section>
  );
}

export function PromoBanner({ config = {}, kind = "desk" }) {
  const defaults = {
    desk: {
      title: (
        <>
          Your desk.
          <br />
          Your story<span className="red-dot">.</span>
        </>
      ),
      link: "/category/office",
      cta: "Shop desk setups",
    },
    school: {
      title: (
        <>
          Back to school<span className="red-dot">.</span>
        </>
      ),
      subtitle: "Without the boring part.",
      link: "/back-to-school",
      cta: "Shop school essentials",
    },
    gifts: {
      title: (
        <>
          Gifts that
          <br />
          mean more<span className="red-dot">.</span>
        </>
      ),
      link: "/gifts",
      cta: "Shop gifts",
    },
    corporate: {
      title: (
        <>
          Corporate &<br />
          bulk orders<span className="red-dot">.</span>
        </>
      ),
      subtitle:
        "Custom stationery. Branded notebooks. Event supplies. We can do that.",
      link: "/corporate",
      cta: "Get a quote",
    },
  };
  const data = defaults[kind];
  return (
    <section className={`ink-promo ink-promo-${kind}`}>
      <div
        className="promo-art"
        role="img"
        aria-label={
          kind === "school"
            ? "Girl with a school backpack in a sunny city"
            : kind === "gifts"
              ? "Thoughtfully wrapped gift with a red ribbon"
              : kind === "corporate"
                ? "Stacked premium stationery notebooks"
                : "A creative stationery desk"
        }
        style={
          config.image
            ? {
                backgroundImage: `url("${config.image}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      <div className="promo-copy">
        <h2>{config.title || data.title}</h2>
        {(config.subtitle || data.subtitle) && (
          <p>{config.subtitle || data.subtitle}</p>
        )}
        <Button to={config.link || data.link}>
          {config.cta || data.cta}
          <ArrowRight size={15} />
        </Button>
      </div>
    </section>
  );
}
