import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { env } from '../src/utils/env';

type Category = { id: number; name: string };

async function getAnyCategory(request: any): Promise<Category> {
  const res = await request.get(`${env.apiUrl}/categories`);
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  const list: Category[] = Array.isArray(json) ? json : json.data || [];
  const chosen = list.find((c) => c?.name && !/all/i.test(c.name)) || list[0];
  if (!chosen) throw new Error('No categories returned from API');
  return chosen;
}

test.describe('Products - Filter by Category', () => {
  test('Filter products by a category from the UI', async ({ page, request }) => {
    const category = await getAnyCategory(request);

    const products = new ProductsPage(page);
    await products.openHome();

    const beforeCount = await products.productNameLinks.count();

    // Try checkbox first (common in filter sidebars), otherwise click the text.
    const checkbox = page.getByRole('checkbox', { name: new RegExp(category.name, 'i') });
    if ((await checkbox.count()) > 0) {
      await checkbox.check();
    } else {
      await page.getByText(category.name, { exact: true }).click();
    }

    // Wait for results to refresh.
    await expect(products.productNameLinks.first()).toBeVisible();

    const afterCount = await products.productNameLinks.count();
    // Filtering should change the result set (count may go up/down depending on data changes).
    expect(afterCount).not.toBe(beforeCount);
  });
});
