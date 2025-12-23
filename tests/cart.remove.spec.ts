import { test, expect } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductDetailsPage } from '../src/pages/ProductDetailsPage';
import { CartPage } from '../src/pages/CartPage';

test.describe('Cart - Remove product', () => {
  test('Remove a product from the cart', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.openHome();

    // Add something first
    await products.openFirstProduct();
    const details = new ProductDetailsPage(page);
    await details.addToCart();

    // Go to cart and remove
    await products.openCart();
    const cart = new CartPage(page);
    await expect(cart.cartItems.first()).toBeVisible();

    await cart.removeFirstItem();
    // Verify cart becomes empty
    await expect.poll(async () => (await cart.cartItems.count()) === 0).toBeTruthy();
  });
});
