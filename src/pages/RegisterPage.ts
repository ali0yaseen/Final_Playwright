import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type RegisterData = {
  firstName: string;
  lastName: string;
  dob: string; // yyyy-mm-dd
  address: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  password: string;
};

export class RegisterPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;
  readonly address: Locator;
  readonly postcode: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly phone: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);

    const by = (selectors: string) => page.locator(selectors);

    this.firstName = by('[data-test="first-name"], input#first_name, input[name="first_name"], input[name="firstname"], input[placeholder*="First" i]');
    this.lastName = by('[data-test="last-name"], input#last_name, input[name="last_name"], input[name="lastname"], input[placeholder*="Last" i]');
    this.dob = by('[data-test="dob"], input#dob, input[name="dob"], input[type="date"]');
    this.address = by('[data-test="address"], input#address, textarea#address, input[name="address"], textarea[name="address"]');
    this.postcode = by('[data-test="postcode"], input#postcode, input[name="postcode"], input[name="zip"], input[placeholder*="Post" i]');
    this.city = by('[data-test="city"], input#city, input[name="city"]');
    this.state = by('[data-test="state"], input#state, input[name="state"]');
    this.country = by('[data-test="country"], input#country, input[name="country"]');
    this.phone = by('[data-test="phone"], input#phone, input[name="phone"], input[type="tel"]');
    this.email = by('[data-test="email"], input#email, input[name="email"], input[type="email"]');
    this.password = by('[data-test="password"], input#password, input[name="password"], input[type="password"]');
    this.registerButton = by('[data-test="register-submit"], button[type="submit"], button:has-text("Register")');
  }

  async open() {
    await this.goto('/auth/register');
    await expect(this.page).toHaveURL(/\/auth\/register/);
  }

  async register(data: RegisterData) {
    await expect(this.firstName).toBeVisible();

    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.dob.fill(data.dob);
    await this.address.fill(data.address);
    await this.postcode.fill(data.postcode);
    await this.city.fill(data.city);
    await this.state.fill(data.state);
    await this.country.fill(data.country);
    await this.phone.fill(data.phone);
    await this.email.fill(data.email);
    await this.password.fill(data.password);

    await this.registerButton.click();
  }
}
