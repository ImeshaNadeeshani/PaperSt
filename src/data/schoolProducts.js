const items = [
  [
    "Exercise Books",
    180,
    "80-page ruled book for everyday class notes.",
    "80 pages",
  ],
  [
    "Notebooks",
    450,
    "A5 spiral notebook with a sturdy cover and 120 ruled pages.",
    "A5 · 120 pages",
  ],
  [
    "Pens",
    150,
    "Three smooth-writing blue ballpoint pens for schoolwork.",
    "Pack of 3",
  ],
  [
    "Pencils",
    180,
    "Six HB graphite pencils for writing and sketching.",
    "Pack of 6",
  ],
  [
    "Erasers",
    100,
    "Two soft erasers for clean, gentle corrections.",
    "Pack of 2",
  ],
  [
    "Pencil Sharpeners",
    120,
    "A compact sharpener with a shavings container.",
    "Single",
  ],
  ["Rulers", 100, "A clear 30 cm ruler with easy-to-read markings.", "30 cm"],
  [
    "Colour Pencils",
    650,
    "Twelve bright coloured pencils in a protective box.",
    "12 colours",
  ],
  [
    "Crayons",
    350,
    "Twelve wax crayons for colourful classroom creations.",
    "12 colours",
  ],
  [
    "Marker Pens",
    550,
    "Six washable colour markers for posters and projects.",
    "6 colours",
  ],
  [
    "Highlighters",
    450,
    "Four pastel highlighters for notes and revision.",
    "Pack of 4",
  ],
  [
    "Geometry Boxes",
    850,
    "A geometry kit with compass, set squares and protractor.",
    "8-piece set",
  ],
  [
    "Pencil Cases",
    650,
    "A zipped fabric case to keep school essentials together.",
    "Standard",
  ],
  [
    "Glue Sticks",
    200,
    "A 21 g glue stick for paper crafts and school projects.",
    "21 g",
  ],
  [
    "Scissors",
    250,
    "Small school scissors with comfortable grips and rounded tips.",
    "School size",
  ],
  [
    "Drawing Books",
    350,
    "An A4 drawing book with 40 plain pages.",
    "A4 · 40 pages",
  ],
  [
    "Graph Books",
    220,
    "An 80-page graph book for maths, charts and diagrams.",
    "80 pages",
  ],
  [
    "Files & Folders",
    300,
    "Three document folders for organising worksheets.",
    "Pack of 3",
  ],
  [
    "School Labels",
    150,
    "Twenty-four write-on labels for books and belongings.",
    "24 labels",
  ],
  [
    "A4 Paper",
    1400,
    "A ream of 500 A4 sheets, 80 gsm, for printing and projects.",
    "500 sheets · 80 gsm",
  ],
];
export const schoolProducts = items.map(
  ([name, price, description, size], index) => ({
    id: `school-${index + 1}`,
    slug: `school-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    SKU: `PST-SCH-${String(index + 1).padStart(3, "0")}`,
    category: "School",
    subcategory: name,
    brand: "Paperist",
    description,
    price,
    salePrice: null,
    rating: 0,
    reviewCount: 0,
    stock: 50,
    images: [`/images/school/${index + 1}.svg`],
    variants: {
      Size: [size],
      Colour: ["Standard"],
      "Paper Type": ["Standard"],
    },
    featured: false,
    bestSeller: false,
    newArrival: false,
    status: "Active",
    samplePrice: true,
  }),
);
export function migrateSchoolProducts(products) {
  const ids = new Set(products.map((product) => product.id));
  return [
    ...products,
    ...schoolProducts.filter((product) => !ids.has(product.id)),
  ];
}
