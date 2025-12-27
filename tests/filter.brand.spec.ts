import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';

test('Filter products by a brand from the UI', async ({ page }) => {
  const products = new ProductsPage(page);

  await products.openHome();

  await page.locator('input[type="checkbox"]').first().check();

  await page.waitForTimeout(1000);

  const count = await products.productNameLinks.count();
  expect(count).toBeGreaterThan(0);
});
