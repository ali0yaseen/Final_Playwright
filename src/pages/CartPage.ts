import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly removeButtons: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

    // Try multiple selectors to stay compatible with site versions.
    this.cartItems = page.locator(
      '[data-test="cart-item"], [data-test^="cart-item"], .cart-item, tr:has([data-test="product-name"])'
    );
    this.cartItemNames = this.cartItems.locator('[data-test="product-name"], .product-name, a');
    this.removeButtons = this.cartItems.locator(
      '[data-test="remove-from-cart"], [data-test="remove"], button:has-text("Remove"), button:has-text("Delete")'
    );
    this.emptyState = page.locator('text=/cart is empty/i, text=/your cart is empty/i');
  }

  async open() {
    await this.goto('/cart');
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async getItemNames(): Promise<string[]> {
    const count = await this.cartItemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.cartItemNames.nth(i).textContent())?.trim();
      if (text) names.push(text);
    }
    return names;
  }

  async removeFirstItem() {
    if ((await this.removeButtons.count()) === 0) {
      throw new Error('No remove buttons found in cart.');
    }
    await this.removeButtons.first().click();
  }

  async clearCart(maxRemovals = 10) {
    for (let i = 0; i < maxRemovals; i++) {
      const items = await this.cartItems.count();
      if (items === 0) break;
      await this.removeFirstItem();
      // Small wait for UI to update.
      await this.page.waitForTimeout(300);
    }
  }

  async expectEmpty() {
    // Prefer count, fallback to empty message.
    const itemCount = await this.cartItems.count();
    if (itemCount === 0) {
      await expect(this.cartItems).toHaveCount(0);
      return;
    }
    await expect(this.emptyState).toBeVisible();
  }
}
