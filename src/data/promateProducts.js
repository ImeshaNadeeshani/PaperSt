import source from "./promate-source.json";

// Prices and availability are a snapshot of the ProMate brand listing.
export const promateProducts = source.map((item, index) => {
  const amounts = item.price.match(/[\d,]+\.\d{2}/g)?.map((value) => Number(value.replaceAll(",", ""))) || [];
  const salePrice = amounts.length > 1 && amounts[1] > amounts[0] ? amounts[0] : null;
  const words = item.name.toLowerCase();
  const category = /book|notepad|journal/.test(words) ? "Notebooks" : /paper/.test(words) ? "Paper" : /pen|pencil|marker/.test(words) ? "Pens" : "Office";
  return {
    id: `promate-${encodeURIComponent(item.url.split("/").pop())}`,
    slug: `promate-item-${index + 1}`,
    name: item.name,
    SKU: item.id ? `PROMATE-${item.id}` : `PROMATE-${index + 1}`,
    category,
    subcategory: "Stationery",
    brand: "Promate",
    description: item.name,
    price: salePrice === null ? amounts[0] : amounts[1],
    salePrice,
    stock: item.available ? 1 : 0,
    images: [item.image],
    variants: { Size: ["Standard"], Colour: ["Standard"], "Paper Type": ["Standard"] },
    rating: 0,
    reviewCount: 0,
    status: "Active",
  };
});
