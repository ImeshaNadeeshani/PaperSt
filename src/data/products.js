import { schoolProducts } from "./schoolProducts.js";
import { officeProducts } from "./officeProducts.js";
export const categories = [
  "Notebooks",
  "Pens",
  "Planners",
  "Art Supplies",
  "Desk & Organisers",
  "School",
  "Gifts",
  "Paper",
  "Books",
  "Journals",
  "Accessories",
  "Office",
];
export const photos = {
  desk: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85",
  notebooks:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85",
  pens: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=85",
  art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85",
  journal:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=85",
};
const names = [
  "Kokuyo Campus Notebook",
  "MUJI Style Gel Pen 0.5",
  "Stabilo Pastel Highlighter Set",
  "Minimal Desk Organiser",
  "Canvas Pencil Case",
  "Undated Weekly Planner",
  "Artist Sketchbook",
  "Sakura Watercolour Set",
  "Everyday School Backpack",
  "Precision Geometry Set",
  "Campus Exercise Book",
  "Linen Bound Journal",
  "Brass Bookmark",
  "Washi Tape Collection",
  "Dot Grid Notebook",
  "Blackwing Graphite Pencils",
  "Kraft Gift Set",
  "Pastel Sticky Notes",
  "Watercolour Paper Pad",
  "Desktop Scissors",
  "Midori Letter Set",
  "Pocket Reading Journal",
  "Ceramic Pen Cup",
  "Coloured Paper Pack",
];
const cats = [
  "Notebooks",
  "Pens",
  "Pens",
  "Desk & Organisers",
  "School",
  "Planners",
  "Art Supplies",
  "Art Supplies",
  "School",
  "School",
  "Books",
  "Journals",
  "Accessories",
  "Gifts",
  "Notebooks",
  "Pens",
  "Gifts",
  "Office",
  "Paper",
  "Office",
  "Paper",
  "Journals",
  "Desk & Organisers",
  "Paper",
];
export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
export const money = (n) => `Rs. ${Number(n).toLocaleString("en-LK")}`;
export const products = [
  ...names.map((name, i) => ({
    id: String(i + 1),
    slug: slugify(name),
    name,
    SKU: `PPR-${1001 + i}`,
    category: cats[i],
    subcategory: "Everyday essentials",
    brand: ["Kokuyo", "MUJI", "Stabilo", "Paperist", "Midori", "Sakura"][i % 6],
    description:
      "A little everyday inspiration. Thoughtfully chosen materials and beautiful details for your next great idea.",
    price: [690, 390, 1850, 2490, 1290, 1890, 1490, 3490, 5490, 990, 290, 2290][
      i % 12
    ],
    salePrice: i % 5 === 0 ? 590 : null,
    rating: 4.5 + (i % 5) / 10,
    reviewCount: 12 + i * 3,
    stock: i === 19 ? 0 : 8 + i,
    images: [
      cats[i] === "Pens"
        ? photos.pens
        : cats[i] === "Art Supplies"
          ? photos.art
          : i % 3 === 0
            ? photos.journal
            : photos.notebooks,
      photos.desk,
    ],
    variants: {
      Size: ["A5", "A4", "Pocket"],
      Colour: ["Natural", "Navy", "Sage"],
      "Paper Type": ["Ruled", "Dot", "Plain"],
    },
    featured: i < 8,
    bestSeller: i % 2 === 0,
    newArrival: i > 15,
    status: "Active",
  })),
  ...schoolProducts,
  ...officeProducts,
];
