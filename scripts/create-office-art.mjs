import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { officeProducts } from "../src/data/officeProducts.js";

const rect = (x, y, w, h, c, r = 5) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="#243b50" stroke-width="2"/>`;
const line = (x, y, a, b, c = "#243b50", w = 2) =>
  `<path d="M${x} ${y}L${a} ${b}" stroke="${c}" stroke-width="${w}"/>`;
const text = (x, y, s, size = 14) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="#243b50">${s}</text>`;
const clip = (x, y, angle = 0) =>
  `<g transform="rotate(${angle} ${x} ${y})"><path d="M${x + 26} ${y + 16}v70q0 25-17 25t-17-25v-68q0-17 13-17t13 17v63q0 9-7 9t-7-9v-54" fill="none" stroke="#638592" stroke-width="5" stroke-linecap="round"/></g>`;
const customs = {
  5: `<g transform="rotate(-12 160 160)">${rect(50, 70, 142, 140, "#e8c46e")}${rect(91, 105, 142, 140, "#a5c7bc")}${rect(121, 140, 142, 140, "#df9f91")}${line(132, 166, 251, 166, "#bb796f", 2)}</g>`,
  7: `${rect(65, 202, 199, 30, "#c5c8c5", 7)}<path d="M76 198l24-97 151 44-8 54z" fill="#527c87" stroke="#243b50" stroke-width="3"/><path d="M105 101l149 41" stroke="#8dafb3" stroke-width="13" stroke-linecap="round"/>${rect(219, 185, 26, 19, "#c8d0d3", 3)}`,
  8: `${rect(59, 131, 206, 112, "#7b99a1", 5)}${rect(68, 142, 188, 51, "#fffae9", 3)}${text(162, 164, "STAPLES", 18)}${text(162, 183, "24/6 · 1000", 11)}${Array.from({ length: 12 }, (_, i) => `<path d="M${79 + i * 12} 78v25h10V78" fill="none" stroke="#8298a4" stroke-width="3"/>`).join("")}`,
  9: `${clip(90, 90, -20)}${clip(178, 67, 12)}${clip(156, 177, 70)}`,
  10: `${rect(93, 138, 139, 76, "#2a3d51", 7)}<path d="M119 139v-52q0-22 20-22t20 22v52M168 139v-52q0-22 20-22t20 22v52" fill="none" stroke="#9eaeb5" stroke-width="6"/><path d="M119 214v34h38v-34M173 214v34h38v-34" fill="none" stroke="#9eaeb5" stroke-width="6"/>`,
  11: `${rect(65, 183, 207, 56, "#748f9a", 10)}${rect(82, 97, 173, 67, "#9ab5ba", 12)}${rect(103, 151, 15, 37, "#2a3d51", 3)}${rect(218, 151, 15, 37, "#2a3d51", 3)}${line(78, 199, 258, 199, "#c9d7d4", 3)}${text(168, 132, "paperSt", 16)}`,
  13: `${rect(49, 85, 236, 171, "#b3c8c8", 8)}<path d="M49 86l118 101L285 86" fill="#8eafb5" stroke="#243b50" stroke-width="2"/><circle cx="168" cy="194" r="10" fill="#e7bc76" stroke="#243b50" stroke-width="2"/>`,
  14: `${rect(67, 59, 68, 213, "#496674", 5)}${rect(135, 59, 116, 213, "#769b9b", 5)}${rect(80, 83, 43, 106, "#fff8e6", 3)}${text(101, 113, "A4", 20)}${text(101, 149, "FILE", 12)}<circle cx="102" cy="230" r="12" fill="#d5dedc" stroke="#243b50" stroke-width="3"/>${line(146, 72, 146, 260, "#a4c1b9", 2)}`,
  15: `<g transform="rotate(-12 160 160)">${rect(55, 77, 225, 124, "#d8c5a4", 3)}${rect(42, 109, 225, 124, "#fffaf0", 3)}<path d="M43 110l111 80L267 110M43 232l92-77M267 232l-92-77" fill="none" stroke="#b5b4a7" stroke-width="2"/></g>`,
  16: `<path d="M63 233v-43q0-47 44-47h58l41-64h46v154z" fill="#537581" stroke="#243b50" stroke-width="3"/><circle cx="110" cy="166" r="49" fill="#e4d1a5" stroke="#243b50" stroke-width="3"/><circle cx="110" cy="166" r="24" fill="#fffaf0" stroke="#243b50" stroke-width="3"/>${rect(203, 78, 50, 17, "#b2c1c6", 2)}${line(215, 77, 215, 89)}${line(228, 77, 228, 89)}${line(241, 77, 241, 89)}`,
  20: `${rect(54, 134, 222, 119, "#bbaa8b", 7)}${rect(63, 91, 74, 108, "#cabc9d", 4)}${rect(147, 163, 119, 80, "#ddd2b8", 4)}${rect(164, 119, 85, 80, "#8ba6a6", 4)}${line(75, 119, 75, 47, "#52798a", 9)}${line(94, 119, 94, 54, "#d2aa67", 9)}${line(114, 119, 120, 42, "#bc8171", 9)}${rect(69, 178, 62, 57, "#dacfb7", 2)}${text(100, 209, "paperSt", 10)}`,
};
mkdirSync("public/images/office", { recursive: true });
officeProducts.forEach((product, i) => {
  let svg;
  if (product.schoolArt)
    svg = readFileSync(
      `public/images/school/${product.schoolArt}.svg`,
      "utf8",
    ).replace(
      /<title>.*?<\/title>/,
      `<title>${product.name.replaceAll("&", "&amp;")}</title>`,
    );
  else
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><title>${product.name.replaceAll("&", "&amp;")}</title><defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-opacity=".13"/></filter></defs><rect width="320" height="320" fill="#f5f5f0"/><circle cx="160" cy="160" r="130" fill="#e7ece8"/><ellipse cx="164" cy="282" rx="105" ry="9" fill="#243b5010"/><g filter="url(#shadow)">${customs[i + 1]}</g></svg>`;
  writeFileSync(`public/images/office/${i + 1}.svg`, svg);
});
writeFileSync(
  "public/images/office/banner.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400"><rect width="960" height="400" fill="#e6efea"/><path d="M0 312h960v88H0" fill="#d7c5a5"/><rect x="520" y="30" width="245" height="210" rx="8" fill="#faf9ed" stroke="#c2d7d5" stroke-width="10"/><path d="M642 30v210M520 136h245" stroke="#c2d7d5" stroke-width="8"/><g transform="translate(55 60) scale(.9)">${customs[20]}</g><g transform="translate(355 95) rotate(-8) scale(.85)">${customs[7]}</g><g transform="translate(650 30) rotate(6)">${customs[14]}</g></svg>`,
);
console.log("Created 20 office product illustrations and banner.");
