import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export class ProductsPage extends BasePage {
  readonly productNameLinks: Locator;
  readonly productPrices: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);

    this.productNameLinks = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
    this.searchInput = page.locator('[data-test="search-query"]');
    this.sortSelect = page.locator('[data-test="sort"], select#sort');
  }

  async openHome() {
    await this.goto('/');
    await expect(this.productNameLinks.first()).toBeVisible({ timeout: 15000 });
  }

  // ✅ الحل النهائي: افتح cart مباشرة
  async openCart() {
    await this.page.goto('/#/cart');
    await expect(this.page).toHaveURL(/#\/cart/, { timeout: 15000 });
  }

  async openFirstProduct() {
    await this.productNameLinks.first().click();
    await expect(this.page).toHaveURL(/\/product\//);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await expect(this.productNameLinks.first()).toBeVisible();
  }

  async selectSortByVisibleText(labelRegex: RegExp) {
    const options = this.sortSelect.locator('option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      const text = (await options.nth(i).textContent()) || '';
      if (labelRegex.test(text)) {
        await this.sortSelect.selectOption({ label: text });
        return;
      }
    }
  }

  async getVisibleProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productNameLinks.count();

    for (let i = 0; i < count; i++) {
      const t = await this.productNameLinks.nth(i).textContent();
      if (t) names.push(t.trim());
    }
    return names;
  }

  async getVisibleProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    const count = await this.productPrices.count();

    for (let i = 0; i < count; i++) {
      const t = await this.productPrices.nth(i).textContent();
      if (t) prices.push(parsePrice(t));
    }
    return prices;
  }
}
