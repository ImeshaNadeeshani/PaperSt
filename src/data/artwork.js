export function categoryArtworkStyle(index) {
  return {
    backgroundPosition: `${((index % 4) * 100) / 3}% ${index >= 4 ? 100 : 0}%`,
  };
}
const categoryTiles = {
  Notebooks: 0,
  Books: 0,
  Journals: 0,
  Pens: 1,
  Planners: 2,
  "Art Supplies": 3,
  "Desk & Organisers": 4,
  Office: 4,
  School: 5,
  Gifts: 6,
  Paper: 7,
  Accessories: 7,
};
export function productArtworkStyle(product) {
  return categoryArtworkStyle(categoryTiles[product.category] ?? 0);
}
