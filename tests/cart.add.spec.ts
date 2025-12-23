import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';
import { CartPage } from '../src/pages/CartPage';

test.describe('Cart - Add product', () => {
  test.beforeEach(async ({ page }) => {
    const products = new ProductsPage(page);
    await products.openHome();

    // Start from a clean cart so the test is deterministic.
    await products.openCart();
    const cart = new CartPage(page);
    await cart.clearCart();
    await products.openHome();
  });

  test('Add the first product to cart', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.openFirstProduct();

    const details = new ProductDetailsPage(page);
    const name = (await details.productName.first().textContent())?.trim() || '';
    await details.addToCart();

    await products.openCart();
    const cart = new CartPage(page);
    const names = await cart.getItemNames();

    expect(names.length).toBeGreaterThan(0);
    // If we managed to read the product name, assert it exists in cart.
    if (name) {
      expect(names.join(' | ').toLowerCase()).toContain(name.toLowerCase());
    }
  });
});
