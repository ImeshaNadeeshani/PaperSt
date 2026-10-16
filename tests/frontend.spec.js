import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/shop",
  "/category/school",
  "/category/office",
  "/category/paper",
  "/category/books",
  "/category/art",
  "/category/journals",
  "/category/gifts",
  "/category/accessories",
  "/back-to-school",
  "/product/kokuyo-campus-notebook",
  "/search?q=Kokuyo",
  "/wishlist",
  "/cart",
  "/checkout",
  "/order-success",
  "/track-order",
  "/login",
  "/register",
  "/forgot-password",
  "/account",
  "/account/orders",
  "/account/orders/PPR-1042",
  "/account/wishlist",
  "/account/addresses",
  "/account/profile",
  "/account/password",
  "/account/notifications",
  "/about",
  "/contact",
  "/faq",
  "/delivery",
  "/returns",
  "/privacy",
  "/terms",
  "/brands",
  "/new-arrivals",
  "/best-sellers",
  "/sale",
  "/gifts",
  "/blog",
  "/corporate",
  "/admin/login",
  "/admin",
  "/admin/products",
  "/admin/products/new",
  "/admin/products/1/edit",
  "/admin/categories",
  "/admin/brands",
  "/admin/inventory",
  "/admin/orders",
  "/admin/orders/PPR-1042",
  "/admin/customers",
  "/admin/customers/1",
  "/admin/coupons",
  "/admin/reviews",
  "/admin/corporate-orders",
  "/admin/corporate-orders/RFQ-204",
  "/admin/content",
  "/admin/banners",
  "/admin/reports",
  "/admin/users",
  "/admin/settings",
  "/missing-page",
];
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`All routes render without React errors or overflow on ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        !msg.text().includes("Failed to load resource")
      )
        errors.push(msg.text());
    });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main").first()).toBeVisible();
      await expect(
        page.locator("main h1:visible, main h2:visible").first(),
      ).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `overflow at ${route}`).toBe(false);
    }
    expect(errors).toEqual([]);
  });
}
test("Shopping, wishlist persistence, filters and complete checkout", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.locator(".product-card").first().hover();
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: "Add to bag" })
    .click();
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: /Save/ })
    .click();
  await page.goto("/wishlist");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.goto("/cart");
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.locator(".quantity span")).toHaveText("2");
  await page.getByRole("textbox", { name: "Promo code" }).fill("PAPER10");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("10%");
  await page.getByRole("link", { name: "Checkout", exact: true }).click();
  for (const [label, value] of Object.entries({
    "First name": "Test",
    "Last name": "User",
    Email: "test@example.com",
    "Mobile number": "0771234567",
    Address: "12 Demo Lane",
    City: "Colombo",
    District: "Colombo",
    "Postal code": "00700",
  }))
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: /Continue to delivery/ }).click();
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(
    page.getByRole("heading", { name: "Thank you for your order!" }),
  ).toBeVisible();
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Your bag is waiting for a good idea" }),
  ).toBeVisible();
  await page.goto("/shop?max=500");
  expect(await page.locator(".product-card").count()).toBeGreaterThan(0);
  expect(await page.locator(".product-card .price").evaluateAll((prices) =>
    prices.every((price) => Number(price.textContent.match(/Rs\.\s*([\d,]+)/)[1].replaceAll(",", "")) <= 500),
  )).toBe(true);
  await page.goto("/search?q=Kokuyo");
  expect(await page.locator(".product-card").count()).toBeGreaterThan(0);
});
test("Admin product creation, inventory, order status and CMS controls", async ({
  page,
}) => {
  await page.goto("/admin/products/new");
  await page
    .getByLabel("Product name", { exact: true })
    .fill("Demo Paper Notebook");
  await page.getByLabel("SKU", { exact: true }).fill("TEST-001");
  await page.getByRole("button", { name: /Publish product/ }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await page
    .getByRole("textbox", { name: "Search catalogue" })
    .fill("Demo Paper Notebook");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.goto("/admin/orders/PPR-1042");
  await page
    .getByLabel("Order status", { exact: true })
    .selectOption("Delivered");
  await page.reload();
  await expect(page.getByLabel("Order status", { exact: true })).toHaveValue(
    "Delivered",
  );
  await page.goto("/admin/content");
  await page
    .getByRole("button", { name: "Toggle Hero Banner", exact: true })
    .click();
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveCount(0);
  await page.goto("/admin/content");
  await page
    .getByRole("button", { name: "Toggle Hero Banner", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit Hero Banner", exact: true })
    .click();
  await page
    .getByLabel("Heading", { exact: true })
    .fill("Fresh pages, good ideas.");
  await page.getByRole("button", { name: "Save section" }).click();
  await page.goto("/");
  await expect(page.locator(".hero h1")).toContainText(
    "Fresh pages, good ideas.",
  );
});
test("Mobile navigation and filter drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "Shop", exact: true })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await expect(page.locator(".filter-drawer")).toBeVisible();
  await page
    .locator(".filter-drawer")
    .getByLabel("Category", { exact: true })
    .selectOption("Pens");
  await page
    .locator(".filter-drawer")
    .getByRole("button", { name: /Show/ })
    .click();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Toggle admin menu" }).click();
  await page.getByRole("link", { name: "Inventory", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/inventory$/);
});
