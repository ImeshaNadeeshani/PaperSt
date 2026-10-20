import { products } from "../src/data/products.js";
import { writeFileSync } from "node:fs";
const quote = (value) => "'" + String(value).replaceAll("'", "''") + "'";
const rows = products.map((p) => `(${quote(p.id)},${quote(p.slug)},${quote(p.name)},${p.salePrice ?? p.price},${p.stock},${quote(p.status)},${quote(JSON.stringify(p))}::jsonb)`);
writeFileSync("supabase/seed-products.sql", "-- Demo products: review sample prices and stock before launch.\ninsert into public.products (id,slug,name,price,stock,status,details) values\n" + rows.join(",\n") + "\non conflict (id) do nothing;\n");
