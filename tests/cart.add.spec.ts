import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';

test('Add the first product to cart', async ({ page }) => {
  const products = new ProductsPage(page);
  const details = new ProductDetailsPage(page);

  await products.openHome();
  await products.openFirstProduct();
  await details.addToCart();

  await products.openCart();

  await expect(page.locator('[data-test="product-name"]').first()).toBeVisible();
});
