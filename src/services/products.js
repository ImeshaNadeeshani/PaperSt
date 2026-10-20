export function mapProductRow(row) {
  const details =
    row.details && typeof row.details === "object" ? row.details : {};
  const amount = Number(row.price);
  const original = Number(details.price);
  const hasDiscount = Number.isFinite(original) && original > amount;
  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    !Number.isInteger(Number(row.stock)) ||
    Number(row.stock) < 0
  ) {
    throw new Error("The catalog contains an invalid price or stock value.");
  }
  const variants = Object.fromEntries(
    ["Size", "Colour", "Paper Type"].map((key) => [
      key,
      Array.isArray(details.variants?.[key]) && details.variants[key].length
        ? details.variants[key]
        : ["Standard"],
    ]),
  );
  return {
    ...details,
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    price: hasDiscount ? original : amount,
    salePrice: hasDiscount ? amount : null,
    stock: Number(row.stock),
    status: row.status,
    category: details.category || "Accessories",
    subcategory: details.subcategory || "Everyday essentials",
    brand: details.brand || "PaperSt",
    SKU: details.SKU || String(row.id),
    description: details.description || "Stationery for everyday ideas.",
    images:
      Array.isArray(details.images) && details.images.length
        ? details.images
        : ["/images/official-logo.jpeg"],
    rating: Number(details.rating) || 0,
    reviewCount: Number(details.reviewCount) || 0,
    variants,
  };
}

export async function fetchPublishedProducts(client, signal) {
  const rows = [];
  const batchSize = 500;
  for (let offset = 0; ; offset += batchSize) {
    const { data, error } = await client
      .from("products")
      .select("id,slug,name,price,stock,status,details")
      .eq("status", "Active")
      .order("id")
      .range(offset, offset + batchSize - 1)
      .abortSignal(signal);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < batchSize) break;
  }
  return rows.map(mapProductRow);
}
