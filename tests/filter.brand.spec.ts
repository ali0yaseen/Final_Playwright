import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { env } from '../src/utils/env';

type Brand = { id: number; name: string };

async function getAnyBrand(request: any): Promise<Brand> {
  const res = await request.get(`${env.apiUrl}/brands`);
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  const list: Brand[] = Array.isArray(json) ? json : json.data || [];
  const chosen = list.find((b) => b?.name) || list[0];
  if (!chosen) throw new Error('No brands returned from API');
  return chosen;
}

test.describe('Products - Filter by Brand', () => {
  test('Filter products by a brand from the UI', async ({ page, request }) => {
    const brand = await getAnyBrand(request);

    const products = new ProductsPage(page);
    await products.openHome();

    const beforeCount = await products.productNameLinks.count();

    // Try checkbox first, otherwise click the text.
    const checkbox = page.getByRole('checkbox', { name: new RegExp(brand.name, 'i') });
    if ((await checkbox.count()) > 0) {
      await checkbox.check();
    } else {
      await page.getByText(brand.name, { exact: true }).click();
    }

    await expect(products.productNameLinks.first()).toBeVisible();

    const afterCount = await products.productNameLinks.count();
    expect(afterCount).not.toBe(beforeCount);
  });
});
