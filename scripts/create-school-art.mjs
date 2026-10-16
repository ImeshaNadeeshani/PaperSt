import { mkdirSync, writeFileSync } from "node:fs";
import { schoolProducts } from "../src/data/schoolProducts.js";

const colours = [
  "#db705e",
  "#e9b649",
  "#76a4a3",
  "#6382ab",
  "#a283ae",
  "#d29f87",
];
const rect = (x, y, w, h, c, r = 4) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="#243b50" stroke-width="2"/>`;
const line = (x, y, a, b, c = "#243b50", w = 2) =>
  `<path d="M${x} ${y}L${a} ${b}" stroke="${c}" stroke-width="${w}"/>`;
const text = (x, y, s, size = 14, c = "#243b50") =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="${c}">${s}</text>`;
const pencil = (x, y, c, angle = 0) =>
  `<g transform="rotate(${angle} ${x} ${y})">${rect(x, y, 12, 145, c, 1)}<path d="M${x} ${y + 145}l6 22 6-22" fill="#dfc49c" stroke="#243b50" stroke-width="2"/><path d="M${x + 3} ${y + 158}l3 9 3-9" fill="#243b50"/>${line(x + 4, y + 7, x + 4, y + 138, "#ffffff80", 2)}</g>`;
const book = (c, grid = false, spiral = false, label = "NOTES") =>
  `<g transform="rotate(-8 160 160)">${rect(83, 55, 157, 220, "#dfd9ca")}${rect(76, 48, 157, 220, c)}${line(90, 50, 90, 265, "#ffffff66", 2)}${grid ? Array.from({ length: 7 }, (_, i) => line(105, 105 + i * 18, 210, 105 + i * 18, "#ffffff88", 1)).join("") + Array.from({ length: 7 }, (_, i) => line(105 + i * 17, 105, 105 + i * 17, 223, "#ffffff88", 1)).join("") : ""}${spiral ? Array.from({ length: 12 }, (_, i) => `<ellipse cx="80" cy="${63 + i * 16}" rx="10" ry="4" fill="none" stroke="#243b50" stroke-width="2"/>`).join("") : ""}${rect(108, 76, 96, 53, "#fffaf0")}${text(156, 98, "paperSt", 12)}${text(156, 117, label, 10)}${text(160, 245, "SCHOOL SERIES", 9, "#fffaf0")}</g>`;
const pens = (count, marker = false) =>
  Array.from({ length: count }, (_, i) => {
    const x = 66 + i * (185 / count);
    const c = colours[i % 6];
    return `<g transform="rotate(8 160 160)">${rect(x, 66, marker ? 24 : 12, 173, marker ? c : "#e7e8e6", 3)}${rect(x, 48, marker ? 24 : 12, 56, c, 3)}${line(x + 4, 54, x + 4, 96, "#ffffff99", 2)}<path d="M${x + 3} 239l${marker ? 9 : 3} 17 ${marker ? 9 : 3}-17" fill="#243b50"/></g>`;
  }).join("");
const drawings = [
  book("#537b94", false, false, "EXERCISE BOOK"),
  book("#b28b6c", false, true, "NOTEBOOK"),
  pens(3),
  Array.from({ length: 6 }, (_, i) =>
    pencil(74 + i * 28, 64, "#e6b94a", 8),
  ).join(""),
  `<g transform="rotate(-14 160 160)">${rect(65, 114, 170, 55, "#fffdf7", 8)}${rect(65, 114, 92, 55, "#a4c9cf", 8)}${text(111, 146, "ERASER", 12)}${rect(106, 190, 126, 42, "#f5c1b7", 6)}</g>`,
  `${rect(95, 84, 128, 150, "#9fc7bf", 18)}${rect(95, 84, 128, 48, "#557e85", 12)}<circle cx="159" cy="107" r="17" fill="#243b50"/><circle cx="159" cy="107" r="10" fill="#b9c8cd"/>${rect(116, 151, 84, 55, "#d3e2cf", 7)}${line(125, 164, 191, 183, "#557e85", 3)}`,
  `<g transform="rotate(-32 160 160)">${rect(39, 132, 245, 52, "#e3f1f0", 3)}${Array.from({ length: 25 }, (_, i) => line(47 + i * 9.5, 133, 47 + i * 9.5, i % 5 === 0 ? 155 : 145)).join("")}${Array.from({ length: 6 }, (_, i) => text(47 + i * 47, 172, String(i * 5), 11)).join("")}</g>`,
  `${rect(52, 58, 218, 211, "#eee5ca", 8)}${Array.from({ length: 12 }, (_, i) => pencil(64 + i * 16, 78, colours[i % 6])).join("")}${rect(52, 190, 218, 79, "#759c8f", 5)}${text(161, 223, "COLOUR PENCILS", 16, "#fffaf0")}${text(161, 248, "12 COLOURS", 11, "#fffaf0")}`,
  `${rect(62, 80, 198, 170, "#e8b656", 6)}${Array.from({ length: 8 }, (_, i) => rect(76 + i * 22, 97, 16, 100, colours[i % 6])).join("")}${rect(62, 179, 198, 71, "#e8b656", 4)}${text(161, 212, "CRAYONS", 23)}${text(161, 232, "12 COLOURS", 11)}`,
  pens(6, true),
  Array.from(
    { length: 4 },
    (_, i) =>
      `<g transform="rotate(-12 160 160)">${rect(71 + i * 43, 70, 31, 155, colours[i], 5)}${rect(71 + i * 43, 58, 31, 50, "#334350", 4)}${line(80 + i * 43, 125, 80 + i * 43, 205, "#ffffff80", 3)}</g>`,
  ).join(""),
  `${rect(44, 92, 238, 145, "#617d97", 12)}${rect(56, 104, 214, 119, "#f7f3e6", 8)}<path d="M82 200l35-78 35 78M117 122v90" fill="none" stroke="#536b80" stroke-width="6"/><path d="M173 200l76-71v71z" fill="#a8cdcc" stroke="#243b50" stroke-width="2"/><path d="M173 190a33 33 0 0166 0z" fill="#dfc28c" stroke="#243b50" stroke-width="2"/>`,
  `<g transform="rotate(-9 160 160)">${rect(47, 112, 242, 105, "#527d86", 20)}${line(61, 129, 273, 129, "#e5c17b", 4)}${rect(250, 123, 16, 20, "#e8c786", 3)}${rect(125, 155, 83, 28, "#e6d8bf", 4)}${text(166, 174, "paperSt", 12)}</g>`,
  `${rect(119, 82, 84, 171, "#e6e6d9", 10)}${rect(115, 55, 92, 54, "#df8669", 7)}${rect(120, 129, 82, 85, "#e8bf67", 2)}${text(161, 164, "GLUE", 19)}${text(161, 187, "STICK", 16)}${text(161, 237, "21 g", 12)}`,
  `<g transform="rotate(14 160 160)"><path d="M148 184L108 53Q105 38 117 51L174 174M174 183L212 54Q220 38 208 51L147 175" fill="#c4cdd2" stroke="#243b50" stroke-width="3"/><ellipse cx="130" cy="215" rx="30" ry="37" fill="#da816c" stroke="#243b50" stroke-width="3"/><ellipse cx="193" cy="215" rx="30" ry="37" fill="#da816c" stroke="#243b50" stroke-width="3"/><ellipse cx="130" cy="215" rx="15" ry="22" fill="#faf7ef"/><ellipse cx="193" cy="215" rx="15" ry="22" fill="#faf7ef"/><circle cx="161" cy="173" r="6" fill="#243b50"/></g>`,
  book("#ddac61", false, true, "DRAWING BOOK"),
  book("#79a7a4", true, false, "GRAPH BOOK"),
  `${rect(69, 62, 175, 202, "#89b0ac", 7)}${rect(55, 94, 184, 175, "#deb370", 7)}<path d="M55 106v-23h70l17 23" fill="#deb370" stroke="#243b50" stroke-width="2"/>${rect(98, 127, 174, 145, "#718ca6", 7)}${text(185, 203, "FILES &amp; FOLDERS", 12, "#fffaf0")}`,
  `${rect(65, 57, 193, 220, "#fffcf4", 4)}${Array.from(
    { length: 6 },
    (_, i) => {
      const x = 80 + (i % 2) * 83,
        y = 77 + Math.floor(i / 2) * 60;
      return (
        rect(x, y, 68, 43, ["#b7d2d2", "#edd2bd"][i % 2], 5) +
        line(x + 10, y + 24, x + 58, y + 24, "#688395", 1)
      );
    },
  ).join("")}${text(163, 264, "SCHOOL LABELS", 10)}`,
  `${rect(65, 74, 193, 208, "#dfddd2", 2)}${rect(59, 68, 193, 208, "#fffdf7", 2)}${rect(53, 61, 193, 208, "#fbfaf4", 2)}${rect(53, 61, 193, 106, "#89a9b0", 2)}${text(150, 106, "A4", 36, "#fff")}${text(150, 136, "COPY PAPER", 14, "#fff")}${text(150, 204, "500 SHEETS", 16)}${text(150, 230, "80 GSM", 12)}`,
];
mkdirSync("public/images/school", { recursive: true });
drawings.forEach((body, i) =>
  writeFileSync(
    `public/images/school/${i + 1}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><title>${schoolProducts[i].name.replaceAll("&", "&amp;")}</title><defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#243b50" flood-opacity=".13"/></filter></defs><rect width="320" height="320" fill="#f7f5ef"/><circle cx="161" cy="161" r="132" fill="#eeece3"/><ellipse cx="164" cy="282" rx="105" ry="9" fill="#243b5010"/><g filter="url(#shadow)">${body}</g></svg>`,
  ),
);
console.log(`Created ${drawings.length} school product illustrations.`);
writeFileSync(
  "public/images/school/banner.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 400"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#d6ecee"/><stop offset="1" stop-color="#faf3df"/></linearGradient></defs><rect width="960" height="400" fill="url(#sky)"/><circle cx="830" cy="60" r="120" fill="#fff5d3"/><path d="M0 330Q300 295 960 318V400H0Z" fill="#dbc49e"/><g transform="translate(15 85) rotate(-10) scale(.9)">${drawings[0]}</g><g transform="translate(250 90) rotate(8) scale(.9)">${drawings[7]}</g><g transform="translate(550 50) rotate(-5) scale(.85)">${drawings[11]}</g><g transform="translate(755 100) rotate(12) scale(.7)">${drawings[3]}</g><g transform="translate(510 200) scale(.7)">${drawings[12]}</g></svg>`,
);
