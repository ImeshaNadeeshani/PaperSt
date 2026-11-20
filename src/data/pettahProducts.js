import source from "./pettah-source.json";

// A dated snapshot of the source collection; availability is not an inventory count.
export const pettahProducts = source.products.flatMap((product) =>
  product.variants.map((variant) => {
    const title = variant.title === "Default Title" ? "" : variant.title;
    const name = title ? `${product.title} - ${title}` : product.title;
    const words = name.toLowerCase();
    const category = /pencil|pen|marker|highlighter/.test(words) ? "Pens"
      : /book|notebook/.test(words) ? "Notebooks"
      : /paper|envelope/.test(words) ? "Paper"
      : /paint|crayon|colour/.test(words) ? "Art Supplies" : "Office";
    const image = variant.featured_image?.src || product.images[0]?.src;
    return {
      id: `pettah-${variant.id}`,
      slug: `pettah-${product.handle}-${variant.id}`,
      name,
      SKU: variant.sku || `PET-${variant.id}`,
      category,
      subcategory: "Stationery",
      brand: product.title.split(" ")[0],
      description: `Stationery from ${product.title}.`,
      price: Number(variant.price),
      salePrice: null,
      stock: variant.available ? 1 : 0,
      images: [image, ...product.images.map((item) => item.src).filter((src) => src !== image)],
      variants: { Size: ["Standard"], Colour: ["Standard"], "Paper Type": ["Standard"] },
      rating: 0,
      reviewCount: 0,
      status: "Active",
    };
  }),
);
