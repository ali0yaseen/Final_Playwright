import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/price';

export class ProductsPage extends BasePage {
  // Product list
  readonly productNameLinks: Locator;
  readonly productPrices: Locator;

  // Navigation
  readonly navCart: Locator;
  readonly navSignIn: Locator;
  readonly navSignOut: Locator;

  // Search / sort
  readonly searchInput: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);

    this.productNameLinks = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');

    this.navCart = page.locator('[data-test="nav-cart"], a[href="/cart"]');
    this.navSignIn = page.locator('[data-test="nav-sign-in"], a[href*="/auth/login"]');
    this.navSignOut = page.locator('[data-test="nav-sign-out"], a:has-text("Sign out"), a:has-text("Logout")');

    this.searchInput = page.locator('[data-test="search-query"], input[placeholder*="Search" i]');
    this.sortSelect = page.locator('[data-test="sort"], select[aria-label*="Sort" i], select#sort');
  }

  async openHome() {
    await this.goto('/');
    // Ensure products are loaded
    await expect(this.productNameLinks.first()).toBeVisible();
  }

  async openCart() {
    await this.navCart.click();
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    // Enter usually triggers search.
    await this.searchInput.press('Enter');
    await expect(this.productNameLinks.first()).toBeVisible();
  }

  async selectSortByVisibleText(labelRegex: RegExp) {
    const select = await this.firstPresent(this.sortSelect);
    await expect(select).toBeVisible();

    // Find an option whose text matches the regex and select it.
    const options = select.locator('option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const text = (await option.textContent())?.trim() || '';
      if (labelRegex.test(text)) {
        const value = await option.getAttribute('value');
        if (value) {
          await select.selectOption(value);
        } else {
          await select.selectOption({ label: text });
        }
        return;
      }
    }
    throw new Error(`Sort option not found. Expected an option matching: ${labelRegex}`);
  }

  async getVisibleProductNames(): Promise<string[]> {
    const count = await this.productNameLinks.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.productNameLinks.nth(i).textContent())?.trim();
      if (text) names.push(text);
    }
    return names;
  }

  async getVisibleProductPrices(): Promise<number[]> {
    const count = await this.productPrices.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.productPrices.nth(i).textContent())?.trim();
      if (text) prices.push(parsePrice(text));
    }
    return prices;
  }

  async openFirstProduct() {
    await this.productNameLinks.first().click();
    await expect(this.page).toHaveURL(/\/product\//);
  }

  async openProductByName(name: string) {
    await this.page.locator('[data-test="product-name"]', { hasText: name }).first().click();
    await expect(this.page).toHaveURL(/\/product\//);
  }
}
