import { test, expect } from '@playwright/test';
import { env } from '../src/utils/env';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';

test.describe('Auth - Login / Logout', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Login with a valid account and logout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(env.userEmail, env.userPassword);

    const products = new ProductsPage(page);
    await expect(products.navSignOut).toBeVisible();

    // Logout
    await products.navSignOut.click();
    await expect(products.navSignIn).toBeVisible();
  });
});
