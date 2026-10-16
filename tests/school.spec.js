import { test, expect } from '@playwright/test';
import { schoolProducts } from '../src/data/schoolProducts.js';
import { mkdirSync } from 'node:fs';

test('School collection migrates existing catalog and all twenty products are purchasable', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('school-migration-test')) {
      localStorage.setItem('paperist-products', JSON.stringify([]));
      localStorage.setItem('school-migration-test', 'ready');
    }
  });
  await page.goto('/category/school');
  for (const product of schoolProducts) {
    await expect(page.locator('.product-name', { hasText: new RegExp(`^${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })).toBeVisible();
  }
  expect(await page.locator('.product-image img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(20);
  await page.getByRole('link', { name: 'Pencils', exact: true }).last().click();
  await expect(page.locator('.detail-price')).toContainText('180');
  await page.locator('.purchase-row').getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toContainText('Pencils');
  await expect(page.locator('.summary-line').first()).toContainText('180');
  mkdirSync('artifacts', { recursive: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/category/school');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/school-${width}.png`, fullPage: true });
  }
});
