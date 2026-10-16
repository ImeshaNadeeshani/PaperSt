import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { useShop } from "../../hooks/useShop";
import { money } from "../../data/products";
import { productArtworkStyle } from "../../data/artwork";
import { RatingStars } from "../common/UI";
export function ProductCard({ product: p, illustrated = false }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${p.slug}`}>
          {illustrated ? (
            <div
              className="illustrated-product"
              role="img"
              aria-label={p.name}
              style={productArtworkStyle(p)}
            />
          ) : (
            <img src={p.images[0]} alt={p.name} loading="lazy" />
          )}
        </Link>
        <span className={`product-badge ${p.salePrice ? "sale" : ""}`}>
          {p.salePrice
            ? "A little treat"
            : p.newArrival
              ? "Just landed"
              : p.bestSeller
                ? "Bestseller"
                : "Thoughtfully chosen"}
        </span>
        <button
          className={`wish-button ${wishlist.includes(p.id) ? "saved" : ""}`}
          aria-label={`Save ${p.name}`}
          aria-pressed={wishlist.includes(p.id)}
          onClick={() => toggleWishlist(p.id)}
        >
          <Heart
            size={17}
            fill={wishlist.includes(p.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className="quick-add"
          disabled={!p.stock}
          onClick={() => addToCart(p)}
        >
          <Plus size={15} /> {p.stock ? "Add to bag" : "Sold out"}
        </button>
      </div>
      <div className="product-meta">
        <span>{p.brand}</span>
        {p.rating > 0 && <RatingStars rating={p.rating} />}
      </div>
      <Link className="product-name" to={`/product/${p.slug}`}>
        {p.name}
      </Link>
      <div className="price">
        {money(p.salePrice ?? p.price)}{" "}
        {p.salePrice && <del>{money(p.price)}</del>}
      </div>
      {p.samplePrice && (
        <small className="school-pack-size">{p.variants.Size[0]}</small>
      )}
    </article>
  );
}
export function ProductGrid({ products, illustrated = false }) {
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} illustrated={illustrated} />
      ))}
    </div>
  );
}
