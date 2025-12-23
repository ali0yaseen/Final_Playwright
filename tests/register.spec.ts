import { test, expect } from '@playwright/test';
import { RegisterPage } from '../src/pages/RegisterPage';
import { uniqueEmail } from '../src/utils/random';
import { env } from '../src/utils/env';

test.describe('Auth - Register', () => {
  // Force a clean (logged-out) context for registration.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Register a new user', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.open();

    const email = uniqueEmail('hw3');

    await register.register({
      firstName: env.defaultFirstName,
      lastName: env.defaultLastName,
      dob: '1999-01-01',
      address: 'Nablus Street 1',
      postcode: '00000',
      city: 'Nablus',
      state: 'West Bank',
      country: 'Palestine',
      phone: '0590000000',
      email,
      password: env.userPassword
    });

    // Expected: registration success message OR redirect to login.
    const successMessage = page.locator('text=/registration (successful|completed)|successfully registered/i');

    // Use a flexible assertion since UI may change.
    await expect
      .poll(async () => {
        const url = page.url();
        const okUrl = /\/auth\/login/.test(url);
        const okMsg = await successMessage.isVisible().catch(() => false);
        return okUrl || okMsg;
      })
      .toBeTruthy();
  });
});
