import type { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    // baseURL is set in playwright.config.ts
    await this.page.goto(path);
  }

  /**
   * Returns the first locator that is present in the DOM.
   * This is useful when the app changes attributes between versions.
   */
  async firstPresent(...candidates: Locator[]): Promise<Locator> {
    for (const loc of candidates) {
      if ((await loc.count()) > 0) return loc;
    }
    // Fallback to the first (will fail later with a clear error)
    return candidates[0];
  }
}
