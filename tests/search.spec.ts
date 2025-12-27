import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';

test('Search for a product and validate results', async ({ page }) => {
  const products = new ProductsPage(page);
  const term = 'hammer';

  await products.openHome();
  await products.search(term);

  const names = await products.getVisibleProductNames();

  // يوجد نتائج
  expect(names.length).toBeGreaterThan(0);

  // على الأقل نتيجة واحدة مطابقة
  const hasMatch = names.some(name =>
    name.toLowerCase().includes(term.toLowerCase())
  );

  expect(hasMatch).toBe(true);
});
