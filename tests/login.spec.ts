import { test, expect } from '@playwright/test';
test('Login with a valid account and logout', async ({ page }) => {
  await page.goto('/');

  const logoutBtn = page.locator('[data-test="nav-sign-out"]');

  await expect(logoutBtn).toHaveCount(1);

  await logoutBtn.click({ force: true });

  await expect(page).toHaveURL(/login|auth/);
});
