import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

test("Reference checkout keeps products and previews partner and KOKO choices", async ({ page }) => {
  await page.route("**/rest/v1/products?**", route => route.fulfill({ json: [row] }));
  await page.goto("/product/remote-notebook");
  await page.locator(".purchase-row .button").click();
  await page.goto("/checkout");
  for (const [label, value] of Object.entries({ "First name": "Test", "Last name": "Customer", Email: "test@example.com", "Mobile number": "0771234567", Address: "Example Road", City: "Colombo", District: "Colombo", "Postal code": "00500" })) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: /Continue to delivery/ }).click();
  await page.getByRole("button", { name: "Uber", exact: true }).click();
  await expect(page.getByRole("button", { name: "Uber", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await page.getByRole("radio", { name: "KOKO (preview)", exact: true }).check();
  await expect(page.locator(".installment-grid > div")).toHaveCount(3);
  mkdirSync("artifacts", { recursive: true });
  await page.screenshot({ path: "artifacts/reference-payment.png", fullPage: true });
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.locator(".reference-success")).toContainText("Thank you for your order");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("paperist-orders"))[0].deliveryPartner)).toBe("Uber");
});

const row = {
  id: "remote-only",
  slug: "remote-notebook",
  name: "Cloud Notebook",
  price: 750,
  stock: 3,
  status: "Active",
  details: {
    category: "Notebooks",
    price: 900,
    salePrice: 590,
    stock: 50,
    images: ["/images/school/2.svg"],
  },
};
test("Catalog uses database records, authoritative price and stock", async ({
  page,
}) => {
  await page.route("**/rest/v1/products?**", (route) =>
    route.fulfill({ json: [row] }),
  );
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".price")).toContainText("750");
  await page.locator(".product-name").click();
  await expect(page.locator(".stock")).toContainText("3 available");
  await page.locator(".purchase-row .button").click();
  await page.goto("/cart");
  await expect(page.locator(".summary-line").first()).toContainText("750");
});
test("Failed reads show retry instead of demo data; empty cloud catalog stays empty", async ({
  page,
}) => {
  let failed = true;
  await page.route("**/rest/v1/products?**", (route) =>
    failed
      ? route.fulfill({ status: 503, json: { message: "Unavailable" } })
      : route.fulfill({ json: [] }),
  );
  await page.goto("/shop");
  await expect(page.getByRole("alert")).toContainText("couldn't load");
  failed = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.locator(".product-card")).toHaveCount(0);
});
