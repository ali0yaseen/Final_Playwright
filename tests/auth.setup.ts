import { test, expect } from '@playwright/test';
import { env } from '../src/utils/env';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

// This runs once per test run (per project dependency) and saves the login session.
// Other tests use storageState.json so they DON'T need to log in each time.

test('Login once and save storageState', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(env.userEmail, env.userPassword);

  const products = new ProductsPage(page);
  // After login, the navigation usually shows Sign out/Logout.
await expect(page).toHaveURL(/\/account|\/products|\/dashboard/);


  await page.context().storageState({ path: 'storageState.json' });
});
