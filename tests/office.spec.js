import { test, expect } from '@playwright/test';
import { officeProducts } from '../src/data/officeProducts.js';
import { mkdirSync } from 'node:fs';

test('Office products have images and prices, support cart and fit mobile', async ({ page }) => {
  await page.goto('/category/office');
  for (const product of officeProducts) {
    await expect(page.locator('.product-name').filter({ hasText: product.name }).first()).toBeVisible();
    const card = page.locator('.product-card').filter({ has: page.locator(`a[href="/product/${product.slug}"]`) });
    await expect(card.locator('.price')).toContainText(product.price.toLocaleString('en-LK'));
    expect(await card.locator('img').evaluate(image => image.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('.product-name').getByText('Staplers', { exact: true }).click();
  await expect(page.locator('.detail-price')).toContainText('650');
  await page.locator('.purchase-row').getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toContainText('Staplers');
  await expect(page.locator('.summary-line').first()).toContainText('650');
  mkdirSync('artifacts', { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/category/office');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/office-${width}.png`, fullPage: true });
  }
});
