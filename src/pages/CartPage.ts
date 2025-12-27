import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

    // جميع أشكال عناصر السلة المحتملة
    this.cartItems = page.locator(
      'tr:has([data-test="product-name"]), [data-test="cart-item"], .cart-item'
    );

    // لا تربط زر الإزالة بالعنصر (DOM غير ثابت)
    this.removeButtons = page.locator(
      '[data-test="remove-from-cart"], button:has-text("Remove"), button:has-text("Delete")'
    );

    this.emptyState = page.locator(
      'text=/your cart is empty/i, text=/cart is empty/i'
    );
  }

  async open() {
    await this.goto('/#/cart');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveURL(/cart/);
  }

  async removeFirstItem() {
    const before = await this.cartItems.count();
    expect(before).toBeGreaterThan(0);

    await this.removeButtons.first().click();

    // انتظر حتى يتغير العدد فعليًا (أفضل من visibility)
    await expect.poll(
      async () => await this.cartItems.count(),
      { timeout: 15000 }
    ).toBeLessThan(before);
  }

  async clearCart(max = 10) {
    for (let i = 0; i < max; i++) {
      const count = await this.cartItems.count();
      if (count === 0) break;
      await this.removeFirstItem();
    }
  }

  async expectEmpty() {
    await expect.poll(
      async () => await this.cartItems.count()
    ).toBe(0);

    await expect(this.emptyState).toBeVisible();
  }
}
