import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';

type SortCase = {
  title: string;
  option: RegExp;
  validate: (products: ProductsPage) => Promise<void>;
};

test.describe('Products - Sorting', () => {
  const cases: SortCase[] = [
    {
      title: 'Sort by Name (A - Z)',
      option: /name\s*\(\s*a\s*-\s*z\s*\)|name.*a.*z|a.*z/i,
      validate: async (products) => {
        const names = await products.getVisibleProductNames();
        expect(names.length).toBeGreaterThan(1);
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sorted);
      }
    },
    {
      title: 'Sort by Price (High - Low)',
      option: /price\s*\(\s*high\s*-\s*low\s*\)|price.*high.*low|high.*low/i,
      validate: async (products) => {
        const prices = await products.getVisibleProductPrices();
        expect(prices.length).toBeGreaterThan(1);
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sorted);
      }
    }
  ];

  for (const c of cases) {
    test(c.title, async ({ page }) => {
      const products = new ProductsPage(page);
      await products.openHome();

      await products.selectSortByVisibleText(c.option);
      // wait for UI to update
      await page.waitForTimeout(500);

      await c.validate(products);
    });
  }
});
