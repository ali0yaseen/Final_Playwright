import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';

const term = process.env.SEARCH_TERM || 'hammer';

test.describe('Products - Search', () => {
  test('Search for a product and validate results', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.openHome();

    await products.search(term);

    const names = await products.getVisibleProductNames();
    expect(names.length).toBeGreaterThan(0);

    // All visible results should include the term (case-insensitive)
    for (const n of names) {
      expect(n.toLowerCase()).toContain(term.toLowerCase());
    }
  });
});
