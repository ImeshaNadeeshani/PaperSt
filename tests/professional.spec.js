import { test, expect } from "@playwright/test";
import { products } from "../src/data/products.js";
import { mkdirSync } from "node:fs";

test("Professional storefront layouts fit desktop and mobile", async ({ page }) => {
  const rows = products.map(product => ({ id: product.id, slug: product.slug, name: product.name, price: product.salePrice ?? product.price, stock: product.stock, status: product.status, details: product }));
  await page.route("**/rest/v1/products?**", route => route.fulfill({ json: rows }));
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  mkdirSync("artifacts", { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/shop", "/category/school", "/category/office", "/product/kokuyo-campus-notebook", "/contact", "/about", "/login"]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByText("Loading products…", { exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      if (route === "/" || route === "/shop") await page.screenshot({ path: `artifacts/professional-${width}-${route === "/" ? "home" : "shop"}.png` });
    }
  }
  expect(errors).toEqual([]);
});
