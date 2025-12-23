import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';

const minPrice = Number(process.env.PRICE_MIN ?? '1');
const maxPrice = Number(process.env.PRICE_MAX ?? '100');

test.describe('Products - Price Range filter', () => {
  test('Filter products by price range', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.openHome();

    // 1) Try numeric inputs (most stable)
    const minInput = page
      .locator('[data-test="min-price"], [data-test="price-min"], input[name*=min i], input[placeholder*=min i]')
      .first();
    const maxInput = page
      .locator('[data-test="max-price"], [data-test="price-max"], input[name*=max i], input[placeholder*=max i]')
      .first();

    const minInputExists = (await minInput.count()) > 0;
    const maxInputExists = (await maxInput.count()) > 0;

    if (minInputExists && maxInputExists) {
      await minInput.fill(String(minPrice));
      await maxInput.fill(String(maxPrice));

      // Apply filter if there is a button; otherwise Enter usually works.
      const applyBtn = page
        .locator('[data-test="apply-filter"], button:has-text("Apply"), button:has-text("Filter")')
        .first();
      if ((await applyBtn.count()) > 0) {
        await applyBtn.click();
      } else {
        await maxInput.press('Enter');
      }
    } else {
      // 2) Fallback to sliders (best-effort)
      const sliders = page.getByRole('slider');
      const sliderCount = await sliders.count();
      if (sliderCount >= 1) {
        // First slider => min, last slider => max
        const minSlider = sliders.first();
        const maxSlider = sliders.nth(sliderCount - 1);

        await minSlider.focus();
        for (let i = 0; i < 200; i++) {
          const now = Number(await minSlider.getAttribute('aria-valuenow'));
          if (!Number.isNaN(now) && now >= minPrice) break;
          await page.keyboard.press('ArrowRight');
        }

        await maxSlider.focus();
        for (let i = 0; i < 200; i++) {
          const now = Number(await maxSlider.getAttribute('aria-valuenow'));
          if (!Number.isNaN(now) && now <= maxPrice) break;
          await page.keyboard.press('ArrowLeft');
        }
      } else {
        test.fail(true, 'Could not find price range inputs or sliders to interact with.');
      }
    }

    // Wait for UI to refresh.
    await expect(products.productNameLinks.first()).toBeVisible();

    const prices = await products.getVisibleProductPrices();
    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices) {
      expect(p).toBeGreaterThanOrEqual(minPrice);
      expect(p).toBeLessThanOrEqual(maxPrice);
    }
  });
});
