import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

test("Contact layout and validated demo submission", async ({ page }) => {
  mkdirSync("artifacts", { recursive: true });
  for (const width of [1440, 820, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact us." })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/contact-${width}.png`, fullPage: true });
  }
  await page.getByLabel("Full name *").fill("Contact preview");
  await page.getByLabel("Email address *").fill("preview@example.com");
  await page.getByLabel("Your message *").fill("Please tell me more about notebook sizes.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByLabel("Subject *").selectOption("Product information");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("No email was sent");
  await expect(page.getByLabel("Full name *")).toHaveValue("");
  await expect(page.getByRole("link", { name: "View all FAQs" })).toHaveAttribute("href", "/faq");
});
