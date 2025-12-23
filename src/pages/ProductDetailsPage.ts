import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly productName: Locator;
  readonly productBrand: Locator;
  readonly productCategory: Locator;

  constructor(page: Page) {
    super(page);

    this.addToCartButton = page.locator('[data-test="add-to-cart"], button:has-text("Add to cart")');
    this.productName = page.locator('[data-test="product-name"], h1');

    // Some versions expose these fields on details, but keep fallbacks.
    this.productBrand = page.locator('[data-test="product-brand"], text=/^Brand\s*:/i');
    this.productCategory = page.locator('[data-test="product-category"], text=/^Category\s*:/i');
  }

  async addToCart() {
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
  }
}
