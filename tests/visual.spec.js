import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
test("Capture desktop, tablet and mobile layouts with the supplied hero image", async ({
  page,
}) => {
  mkdirSync("artifacts", { recursive: true });
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "tablet", width: 820, height: 1180 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [route, name] of [
      ["/", "home"],
      ["/admin", "admin"],
      ["/shop", "shop"],
    ]) {
      await page.goto(route);
      if (route === "/") {
        await expect(page.locator(".hero-background")).toHaveAttribute(
          "src",
          "/images/paperist-hero.png",
        );
        expect(
          await page
            .locator(".hero-background")
            .evaluate((img) => img.naturalWidth),
        ).toBeGreaterThan(0);
      }
      await page.screenshot({ path: `artifacts/${viewport.name}-${name}.png` });
    }
  }
});
