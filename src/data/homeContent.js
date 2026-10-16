export const homeSectionOrder = [
  "Hero Banner",
  "Category Section",
  "Featured Products",
  "Promotional Banners",
  "Back to School",
  "Gifts",
  "Corporate Orders",
  "New Arrivals",
  "Best Sellers",
  "Paper Section",
  "Social Gallery",
  "Newsletter",
];
export const defaultHomeContent = homeSectionOrder.map((name) => ({
  name,
  visible: true,
}));
export function migrateHomeContent(content) {
  const legacy = [
    "Hero Banner",
    "Category Section",
    "Featured Products",
    "Best Sellers",
    "New Arrivals",
    "Promotional Banners",
    "Back to School",
    "Gifts",
    "Corporate Orders",
    "Paper Section",
    "Social Gallery",
    "Newsletter",
  ];
  if (content.map((x) => x.name).join("|") === legacy.join("|"))
    return [...content].sort(
      (a, b) =>
        homeSectionOrder.indexOf(a.name) - homeSectionOrder.indexOf(b.name),
    );
  return content;
}
