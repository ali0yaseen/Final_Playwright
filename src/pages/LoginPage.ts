import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator(
      '[data-test="email"], input#email, input[name="email"], input[type="email"]'
    );
    this.passwordInput = page.locator(
      '[data-test="password"], input#password, input[name="password"], input[type="password"]'
    );
    this.submitButton = page.locator(
      '[data-test="login-submit"], button[type="submit"], button:has-text("Login")'
    );
    this.loginError = page.locator('text=/invalid credentials|wrong email|wrong password/i');
  }

  async open() {
    await this.goto('/auth/login');
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }

  async login(email: string, password: string) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
